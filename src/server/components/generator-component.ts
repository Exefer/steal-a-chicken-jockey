import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Leaderstats } from "server/modules/leaderstats";
import { PlayerSessionService } from "server/services/player-session-service";
import { Tag } from "shared/constants/game";
import { abbreviator } from "shared/utils/abbreviator";
import { getPlayerFromPart } from "shared/utils/humanoid";

interface Attributes {
  EarnedCash: number;
}

export const GENERATOR_DEFAULT_ATTRIBUTES: Partial<Attributes> = {
  EarnedCash: 0,
};

@Component({
  tag: Tag.Generator,
  defaults: GENERATOR_DEFAULT_ATTRIBUTES,
  instanceGuard: undefined,
})
export class GeneratorComponent extends BaseComponent<Attributes, Plot["Generators"]["Empty"]> implements OnStart {
  private readonly EMPTY_NAME = "Empty";
  private readonly COLLECTOR_COOLDOWN = 1.5;

  private plot: Plot = this.instance.Parent?.Parent as Plot;
  private actualGenerator: Model | undefined;
  private collectorDebounce = false;
  private generationThread: thread | undefined;

  public onStart(): void {
    this.setupGeneratorWatcher();
    this.setupEarnedCashDisplay();
    this.setupCollectorTouchHandler();
  }

  private setupGeneratorWatcher(): void {
    this.instance.GetPropertyChangedSignal("Name").Connect(() => {
      const isActive = this.instance.Name !== this.EMPTY_NAME;

      if (isActive) {
        this.actualGenerator = this.instance.WaitForChild(this.instance.Name) as Model;
        this.startCashGeneration();
      } else {
        this.stopCashGeneration();
        this.actualGenerator = undefined;
      }
    });
  }

  private startCashGeneration(): void {
    if (this.generationThread) return;

    this.generationThread = task.spawn(() => {
      while (task.wait(1)) {
        if (this.actualGenerator) {
          this.attributes.EarnedCash += this.actualGenerator.GetAttribute("Production") as number;
        }
      }
    });
  }

  private stopCashGeneration(): void {
    if (this.generationThread) {
      task.cancel(this.generationThread);
      this.generationThread = undefined;
    }
  }

  private setupEarnedCashDisplay(): void {
    this.onAttributeChanged("EarnedCash", (newValue: number) => {
      this.instance.Collector.BillboardGui.Earned.Text = `$${abbreviator.numberToString(newValue)}`;
    });
  }

  private setupCollectorTouchHandler(): void {
    this.instance.Collector.Touched.Connect(otherPart => this.handleCollectorTouch(otherPart));
  }

  private handleCollectorTouch(otherPart: BasePart): void {
    if (this.collectorDebounce || this.attributes.EarnedCash === 0) return;

    const hitPlayer = getPlayerFromPart(otherPart);
    if (!hitPlayer || !this.isOwner(hitPlayer)) return;

    this.collectorDebounce = true;
    this.collectMoney();
    task.wait(this.COLLECTOR_COOLDOWN);
    this.collectorDebounce = false;
  }

  private collectMoney(): void {
    const player = this.getPlayer();
    const { EarnedCash } = this.attributes;

    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Cash += EarnedCash;
      return data;
    });

    Leaderstats.updateValues(player, {
      Cash: result.Gameplay.Cash,
    });

    this.attributes.EarnedCash = 0;
  }

  private getPlayer(): Player {
    return Players.FindFirstChild(this.plot.Name) as Player;
  }

  private isOwner(player: Player): boolean {
    return player.UserId === this.getPlayer().UserId;
  }
}
