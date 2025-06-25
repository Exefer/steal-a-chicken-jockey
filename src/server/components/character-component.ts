import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { CollectionService, Workspace } from "@rbxts/services";
import { Leaderstats } from "server/modules/leaderstats";
import { Events } from "server/networking";
import { PlayerSessionService } from "server/services/player-session-service";
import { CharacterMutation, CollisionGroup, Tag } from "shared/constants/game";
import { getPlotForPlayer } from "shared/utils";
import { abbreviator } from "shared/utils/abbreviator";
import { getHumanoidRootPart, moveTo } from "shared/utils/humanoid";
import { getLogger } from "shared/utils/setup-logger";

interface Attributes {
  Rarity: string;
  Price: number;
  Production: number;
  // TODO: Add character mutation type from player data store
  Mutation: CharacterMutation;
  BoughtById: number;
}

export const CHARACTER_DEFAULT_ATTRIBUTES: Partial<Attributes> = {
  BoughtById: 0,
  Mutation: CharacterMutation.None,
};

@Component({
  tag: "Character",
  defaults: CHARACTER_DEFAULT_ATTRIBUTES,
  instanceGuard: undefined,
})
export class CharacterComponent extends BaseComponent<Attributes, Model> implements OnStart {
  private readonly logger = getLogger();
  private readonly HOLD_DURATION = 0.5;
  private humanoid = this.instance.FindFirstChildOfClass("Humanoid");

  public onStart(): void {
    Events.characterSpawned.broadcast(this.instance);
    this.setupCollisions();
    this.createProximityPrompt();
    this.positionAndMove();
  }

  private positionAndMove(): void {
    const startPosition = Workspace.CharacterSpawnPart.CFrame.Position;
    const endPosition = Workspace.CharacterDespawnPart.CFrame.Position;

    this.instance.PivotTo(new CFrame(startPosition.add(new Vector3(0, 2, 0))));
    moveTo(this.humanoid!, endPosition);
  }

  private createProximityPrompt(): void {
    const prompt = new Instance("ProximityPrompt");
    const { Price } = this.attributes;

    prompt.ActionText = "Purchase";
    prompt.ObjectText = `${this.instance.Name} $${Price}`;
    prompt.HoldDuration = this.HOLD_DURATION;
    prompt.RequiresLineOfSight = false;
    prompt.Parent = getHumanoidRootPart(this.instance);

    prompt.TriggerEnded.Connect(player => this.handlePurchase(player));
  }

  private handlePurchase(player: Player): void {
    const { Price, BoughtById } = this.attributes;

    // Early returns for invalid purchase conditions
    if (BoughtById === player.UserId) {
      this.logger.Debug(`${player.Name} is already the owner of ${this.instance.Name}!`);
      return;
    }

    if (!this.canPlayerPurchase(player)) {
      this.logger.Debug(`${player.Name} cannot purchase ${this.instance.Name} - generator limit reached`);
      return;
    }

    const profile = PlayerSessionService.getProfile(player);
    if (profile.Gameplay.Cash < Price) {
      Events.alert.fire(player, {
        text: `You need $${abbreviator.numberToString(Price - profile.Gameplay.Cash)} more to buy this`,
        type: "error",
      });
      this.logger.Debug(`${player.Name} does not have enough money to purchase ${this.instance.Name}`);
      return;
    }
    // Mark character as bought by this player
    this.instance.SetAttribute("BoughtById", player.UserId);

    // Process purchase
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Cash -= Price;
      return data;
    });

    Leaderstats.updateValues(player, {
      Cash: result.Gameplay.Cash,
    });

    const plot = getPlotForPlayer(player);
    moveTo(this.humanoid!, plot.CharacterDestination.Position);
  }

  private setupCollisions(): void {
    this.instance
      .GetDescendants()
      .filter(part => part.IsA("BasePart") || part.IsA("MeshPart"))
      .forEach(part => (part.CollisionGroup = CollisionGroup.ChickenJockeys));
  }

  private canPlayerPurchase(player: Player): boolean {
    const emptyGenerators = this.getPlayerEmptyGenerators(player);
    const charactersBeingBought = this.getCharactersBeingBought(player);

    // Total generators = (max generators - empty slots) + characters being bought + this potential purchase
    const maxGenerators = this.getMaxGenerators(player);
    const currentUsedGenerators = maxGenerators - emptyGenerators.size();
    const totalAfterPurchase = currentUsedGenerators + charactersBeingBought.size() + 1;

    return totalAfterPurchase <= maxGenerators;
  }

  private getMaxGenerators(player: Player): number {
    const plot = getPlotForPlayer(player);
    return plot.Generators.GetChildren().size();
  }

  private getPlayerEmptyGenerators(player: Player): Model[] {
    return getPlotForPlayer(player)
      .Generators.GetChildren()
      .filter(generator => generator.Name === "Empty") as Model[];
  }

  private getCharactersBeingBought(player: Player): Model[] {
    return CollectionService.GetTagged(Tag.Character).filter(
      character => character.GetAttribute("BoughtById") === player.UserId
    ) as Model[];
  }
}
