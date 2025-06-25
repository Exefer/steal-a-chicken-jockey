import { OnStart, Service } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import Sift from "@rbxts/sift";
import { OnPlayerAdded, OnPlayerRemoved } from "server/listeners";
import { Leaderstats } from "server/modules/leaderstats";
import { Events } from "server/networking";
import { CharacterSpawnerService } from "server/services/character-spawner-service";
import { PlayerData, PlayerDataStore } from "server/stores/player-data";
import { CollisionGroup, Tag } from "shared/constants/game";
import { getPlotForPlayer } from "shared/utils";
import { getHumanoidRootPart } from "shared/utils/humanoid";

@Service({
  loadOrder: 0,
})
export class PlayerSessionService implements OnStart, OnPlayerAdded, OnPlayerRemoved {
  public onStart(): void {
    game.BindToClose(() => {});
  }

  public onPlayerAdded(player: Player): void {
    // Setup plot and characters
    const plot = this.claimPlot(player);
    player.CharacterAdded.Connect(character => this.setupCharacter(character, plot));
    // Load player data and setup leaderstats
    PlayerDataStore.loadAsync(player);
    const profile = PlayerDataStore.getAsync(player);
    Leaderstats.setup(player, {
      ...Sift.Dictionary.withKeys(profile.Gameplay, "Rebirths", "Steals"),
      Cash: profile.Gameplay.Cash,
    });

    this.addSavedCharactersToPlot(player, plot);

    Events.onDataLoaded.fire(player);
  }

  public onPlayerRemoved(player: Player): void {
    // Extract character data from plot
    const charactersData = this.extractCharactersData(player);

    // Update and save player data
    PlayerDataStore.updateAsync(player, data => {
      data.Gameplay.LastPlayed = os.time();
      data.Gameplay.Characters = charactersData;
      return true;
    });

    // Reset plot and unload data
    const plot = getPlotForPlayer(player);
    this.resetPlot(plot);
    PlayerDataStore.unloadAsync(player);
  }

  private claimPlot(player: Player): Plot {
    const plot = this.getEmptyPlot();
    plot.Name = player.Name;
    plot.SetAttribute("OwnerId", player.UserId);
    plot.Owner.BillboardGui.TextLabel.Text = `${player.Name}'s Base`;
    return plot;
  }

  private setupCharacter(character: Model, plot: Plot): void {
    const rootPart = getHumanoidRootPart(character)!;
    rootPart.CFrame = plot.Spawn.CFrame.mul(CFrame.Angles(0, math.rad(180), 0));
    character.GetChildren().forEach(bodyPart => {
      if (bodyPart.IsA("BasePart")) {
        bodyPart.CollisionGroup = CollisionGroup.PlayerCharacters;
      }
    });
  }

  private resetPlot(plot: Plot): void {
    plot.Name = "Empty";
    for (const [key, value] of pairs({ OwnerId: 0, Locked: false, AllowFriends: false })) {
      plot.SetAttribute(key, value);
    }
    plot.Owner.BillboardGui.TextLabel.Text = "Empty";

    // Reset all generators
    plot.Generators.GetChildren().forEach(generator => {
      // Delete all characters in the generator
      generator.GetChildren().forEach(child => {
        if (child.IsA("Model") && child !== generator.FindFirstChild("Placeholder")) {
          child.Destroy();
        }
      });

      // Reset generator name and attributes
      generator.Name = "Empty";
      generator.SetAttribute("EarnedCash", 0);
    });
  }

  private getEmptyPlot(): Plot {
    return CollectionService.GetTagged(Tag.Plot).find(plot => !plot.GetAttribute("OwnerId")) as Plot;
  }

  private calculateOfflineEarnings(character: Model, secondsOffline: number): number {
    return secondsOffline * (character.GetAttribute("Production") as number);
  }

  private setupSavedCharacter(character: Model, generator: Plot["Generators"]["Empty"], totalEarnedCash: number): void {
    generator.Name = character.Name;
    generator.SetAttribute("EarnedCash", totalEarnedCash);

    // Clear existing tags
    for (const tag of character.GetTags()) {
      character.RemoveTag(tag);
    }

    // Position character in generator
    character.Parent = generator;
    character.PrimaryPart!.Orientation = new Vector3(0, -90, 0);
    character.PivotTo(generator.Placeholder.CFrame);
    character.PrimaryPart!.Anchored = true;
  }

  private addSavedCharactersToPlot(player: Player, plot: Plot): void {
    const profile = PlayerSessionService.getProfile(player);
    const secondsPassed = os.time() - profile.Gameplay.LastPlayed;

    for (const { Name, EarnedCash, Mutation } of profile.Gameplay.Characters) {
      const character = CharacterSpawnerService.cloneCharacterByName(Name);
      if (!character) continue;

      character.SetAttribute("Mutation", Mutation);
      const generator = plot.Generators.FindFirstChild("Empty") as Plot["Generators"]["Empty"];

      const cashEarnedOffline = this.calculateOfflineEarnings(character, secondsPassed);
      const totalEarnedCash = EarnedCash + cashEarnedOffline;

      print(`${character.Name} earned ${cashEarnedOffline} cash for being offline for ${secondsPassed} seconds!`);

      this.setupSavedCharacter(character, generator, totalEarnedCash);
    }
  }

  private extractCharactersData(player: Player) {
    const plot = getPlotForPlayer(player);
    const generators = plot.Generators.GetChildren().filter(g => g.Name !== "Empty") as Model[];
    return generators.map(generator => {
      const character = generator.FindFirstChild(generator.Name) as Model;
      return {
        Name: generator.Name,
        EarnedCash: (generator.GetAttribute("EarnedCash") ?? 0) as number,
        Mutation: character.GetAttribute("Mutation") as string,
      };
    });
  }

  public static updateProfile(player: Player, updateCallback: (profile: PlayerData) => PlayerData): PlayerData {
    const oldData = Sift.Dictionary.copyDeep(PlayerDataStore.getAsync(player));
    const updatedData = updateCallback(oldData);
    PlayerDataStore.updateAsync(player, data => {
      data.Gameplay = updatedData.Gameplay;
      data.Products = updatedData.Products;
      return true;
    });
    return updatedData;
  }

  public static getProfile(player: Player): PlayerData {
    return PlayerDataStore.getAsync(player);
  }
}
