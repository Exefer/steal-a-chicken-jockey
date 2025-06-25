import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, TweenService } from "@rbxts/services";
import { Events } from "server/networking";
import { CharacterSpawnerService } from "server/services/character-spawner-service";
import { PlayerSessionService } from "server/services/player-session-service";
import { Tag } from "shared/constants/game";
import { getPlayerFromPart } from "shared/utils/humanoid";
import { getLogger } from "shared/utils/setup-logger";

interface Attributes {
  OwnerId: number;
  Locked: boolean;
  LockTime: number;
  AllowFriends: boolean;
}

export const PLOT_DEFAULT_ATTRIBUTES: Partial<Attributes> = {
  OwnerId: 0,
  Locked: false,
  LockTime: 0,
  AllowFriends: false,
};

@Component({
  tag: Tag.Plot,
  defaults: PLOT_DEFAULT_ATTRIBUTES,
  instanceGuard: undefined,
})
export class PlotComponent extends BaseComponent<Attributes, Plot> implements OnStart {
  private readonly logger = getLogger();
  private readonly LOCK_DURATION = 60; // seconds
  private readonly LASER_TWEEN_DURATION = 1; // seconds
  private readonly LOCK_TRY_COOLDOWN = 1; // seconds - cooldown for lock activation attempts

  private lastLockTryTime = 0; // Track last lock attempt time
  private lockCountdownThread?: thread; // Track the countdown thread

  public onStart(): void {
    this.setupOwnerChangeTracking();
    this.setupLockTracking();
    this.setupLockActivation();
    this.setupCharacterReachedDestination();
  }

  private setupOwnerChangeTracking(): void {
    this.onAttributeChanged("OwnerId", newValue => {
      if (!newValue) return;
      this.logger.Debug(`${this.getOwnerPlayer()?.Name} is now the owner of this plot: ${this.instance.GetFullName()}`);
    });
  }

  private setupLockTracking(): void {
    this.onAttributeChanged("Locked", locked => {
      this.instance.FirstBarrier.CanCollide = locked;
      this.tweenLasers(locked);

      if (locked) {
        this.logger.Debug(`${this.getOwnerPlayer()?.Name} locked their plot`);
        this.attributes.LockTime = this.LOCK_DURATION; // Set initial lock time
        this.scheduleLockExpiry();
      } else {
        this.logger.Debug(`${this.getOwnerPlayer()?.Name}'s plot is now unlocked`);
        this.attributes.LockTime = 0; // Reset lock time when unlocked
        this.stopLockCountdown(); // Stop any running countdown
      }
    });
  }

  private scheduleLockExpiry(): void {
    // Stop any existing countdown thread
    this.stopLockCountdown();

    // Start new countdown thread
    this.lockCountdownThread = task.spawn(() => {
      while (this.attributes.Locked && this.attributes.LockTime > 0) {
        task.wait(1); // Wait 1 second

        if (!this.attributes.Locked) break; // Exit if unlocked externally

        this.attributes.LockTime = math.max(0, this.attributes.LockTime - 1);

        if (this.attributes.LockTime <= 0) {
          this.logger.Debug(`${this.getOwnerPlayer()?.Name}'s lock duration expired, deactivating`);
          this.tweenLasers(false);
          task.wait(this.LASER_TWEEN_DURATION);
          this.attributes.Locked = false; // This will trigger the attribute change listener
          break;
        }
      }
    });
  }

  private stopLockCountdown(): void {
    if (this.lockCountdownThread) {
      task.cancel(this.lockCountdownThread);
      this.lockCountdownThread = undefined;
    }
  }

  private setupLockActivation(): void {
    this.instance.LockBase.TouchEnded.Connect(otherPart => {
      const currentTime = tick();

      // Check cooldown
      if (currentTime - this.lastLockTryTime < this.LOCK_TRY_COOLDOWN) {
        return;
      }

      const player = getPlayerFromPart(otherPart);
      if (!player || !this.isOwner(player)) return;

      // Update last lock try time
      this.lastLockTryTime = currentTime;

      if (this.attributes.Locked) {
        Events.alert.fire(player, { text: "Your base is already locked!", type: "error" });
        return;
      }

      this.attributes.Locked = true; // This will trigger the attribute change listener
    });
  }

  private isOwner(player: Player): boolean {
    return player.UserId === this.attributes.OwnerId;
  }

  private tweenLasers(visible: boolean): void {
    const targetTransparency = visible ? 0 : 1;
    const targetSize = visible ? new Vector3(1.25, 16, 1) : Vector3.zero;
    const easingDirection = visible ? Enum.EasingDirection.Out : Enum.EasingDirection.In;

    for (const laser of this.instance.Lasers.GetChildren() as Array<BasePart>) {
      TweenService.Create(laser, new TweenInfo(this.LASER_TWEEN_DURATION, Enum.EasingStyle.Cubic, easingDirection), {
        Transparency: targetTransparency,
        Size: targetSize,
      }).Play();
    }
  }

  private getOwnerPlayer(): Player | undefined {
    return Players.GetPlayerByUserId(this.attributes.OwnerId);
  }

  private setupCharacterReachedDestination(): void {
    this.instance.FirstBarrier.Touched.Connect(otherPart => {
      const character = otherPart.FindFirstAncestorWhichIsA("Model");
      if (!character || !character.HasTag(Tag.Character)) return;

      const characterClone = CharacterSpawnerService.cloneCharacterByName(character.Name);
      if (characterClone) {
        characterClone.SetAttribute("Mutation", character.GetAttribute("Mutation"));
        this.addCharacter(characterClone);

        //TODO: enforce CharacterMutation enum
        PlayerSessionService.updateProfile(this.getOwnerPlayer()!, data => {
          data.Gameplay.Characters = [
            ...data.Gameplay.Characters,
            {
              Name: character.Name,
              EarnedCash: 0,
              Mutation: character.GetAttribute("Mutation") as string,
            },
          ];
          return data;
        });
      }

      character.Destroy();
    });
  }

  private addCharacter(character: Model): void {
    // FIXME: Duplicate logic
    const generator = this.instance.Generators.FindFirstChild("Empty") as Plot["Generators"]["Empty"] | undefined;
    if (!generator) return;

    generator.Name = character.Name;

    for (const tag of character.GetTags()) {
      character.RemoveTag(tag);
    }
    character.Parent = generator;

    character.PrimaryPart!.Orientation = new Vector3(0, -90, 0);
    character.PivotTo(generator.Placeholder.CFrame);

    character.PrimaryPart!.Anchored = true;

    Events.characterAddedToPlot.broadcast(generator);
  }
}
