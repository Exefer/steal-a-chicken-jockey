import { Controller, OnStart } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import Vide, { mount, source } from "@rbxts/vide";
import { OnCharacterAddedToPlot, OnCharacterSpawned } from "client/listeners";
import { Events } from "client/networking";
import { CharacterInfo } from "client/ui/components/character-info/character-info";
import { LockStatus } from "client/ui/components/lock-status/lock-status";
import { DevProduct } from "shared/assets";
import { CharacterRarity } from "shared/types";
import { getAllGenerators, getAllPlots, getPlotForPlayer } from "shared/utils";
import { getHumanoidRootPart } from "shared/utils/humanoid";

@Controller()
export class PlayerController implements OnStart, OnCharacterSpawned, OnCharacterAddedToPlot {
  private player = Players.LocalPlayer;
  private plot = getPlotForPlayer(this.player);

  public onStart(): void {
    Events.onDataLoaded.connect(() => {
      getAllGenerators().forEach(generator => {
        generator.GetPropertyChangedSignal("Name").Connect(() => this.addCharacterInfoToGenerator(generator));
        this.addCharacterInfoToGenerator(generator);
      });

      getAllPlots()
        .filter(plot => plot.Name !== this.player.Name)
        .forEach(plot => this.setupPlotTracking(plot));

      this.trackSelfPlot();
    });
  }

  public onCharacterSpawned(character: Model): void {
    this.addCharacterInfoToModel(character);
    const proximityPrompt = getHumanoidRootPart(character)?.FindFirstChildOfClass("ProximityPrompt");
    if (proximityPrompt) {
      character.GetAttributeChangedSignal("BoughtById").Connect(() => {
        proximityPrompt.Enabled = character.GetAttribute("BoughtById") !== this.player.UserId;
      });
    }
  }

  public onCharacterAddedToPlot(generator: Plot["Generators"]["Empty"]): void {
    this.addCharacterInfoToGenerator(generator);
  }

  public addCharacterInfoToGenerator(generator: Plot["Generators"]["Empty"]): void {
    if (generator.Name !== "Empty") {
      const character = generator.WaitForChild(generator.Name) as Model;
      this.addCharacterInfoToModel(character);
    }
  }

  private addCharacterInfoToModel(character: Model): void {
    const head = character.WaitForChild("Head") as BasePart;
    if (!head) return;

    const data = {
      name: character.Name,
      rarity: character.GetAttribute("Rarity") as CharacterRarity,
      production: character.GetAttribute("Production") as number,
      price: character.GetAttribute("Price") as number,
    };

    this.createBillboard(head, () => <CharacterInfo {...data} />, character);
  }

  private createBillboard(adornee: BasePart, content: () => Vide.Node, parent: Instance): void {
    mount(
      () => (
        <billboardgui
          Adornee={adornee}
          Size={new UDim2(1, 0, 0, 75)}
          AlwaysOnTop
          StudsOffset={new Vector3(0, 5, 0)}
          LightInfluence={1}
          MaxDistance={100}
        >
          {content()}
        </billboardgui>
      ),
      parent
    );
  }

  private setupPlotTracking(plot: Plot): void {
    const lockTime = source(0);

    plot.GetAttributeChangedSignal("LockTime").Connect(() => {
      lockTime(plot.GetAttribute("LockTime") as number);
    });

    this.createLockBillboard(plot, lockTime);
    this.setupPlotPrompt(plot);
  }

  private createLockBillboard(plot: Plot, lockTime: Vide.Source<number>): void {
    const lockBase = plot.WaitForChild("LockBase") as BasePart;
    this.createBillboard(lockBase, () => <LockStatus lockTime={lockTime} />, lockBase);
  }

  private setupPlotPrompt(plot: Plot): void {
    const barrier = plot.WaitForChild("FirstBarrier");
    const prompt = new Instance("ProximityPrompt");
    prompt.ActionText = "Unlock Base";
    prompt.Parent = barrier;

    const updatePrompt = () => (prompt.Enabled = plot.GetAttribute("Locked") as boolean);
    updatePrompt();

    plot.GetAttributeChangedSignal("Locked").Connect(updatePrompt);
    plot.GetPropertyChangedSignal("Name").Connect(() => this.handlePlotNameChange(plot, barrier));
    prompt.Triggered.Connect(() => this.handleBaseUnlock(plot.Name));
  }

  private handlePlotNameChange(plot: Plot, barrier: Instance): void {
    const existing = barrier.FindFirstChildOfClass("ProximityPrompt");
    existing?.Destroy();

    if (plot.Name !== "Empty") {
      const newPrompt = new Instance("ProximityPrompt");
      newPrompt.ActionText = "Unlock Base";
      newPrompt.Parent = barrier;
      newPrompt.Triggered.Connect(() => this.handleBaseUnlock(plot.Name));
    }
  }

  private trackSelfPlot(): void {
    const lockTime = source(0);

    this.plot.GetAttributeChangedSignal("Locked").Connect(() => {
      this.plot.FirstBarrier.CanCollide = false;
    });

    this.plot.GetAttributeChangedSignal("LockTime").Connect(() => {
      lockTime(this.plot.GetAttribute("LockTime") as number);
    });

    this.createLockBillboard(this.plot, lockTime);
  }

  private handleBaseUnlock(ownerName: string): void {
    const victim = Players.FindFirstChild(ownerName) as Player;
    Events.unlockBase.fire(victim);
    MarketplaceService.PromptProductPurchase(this.player, DevProduct.UnlockBase);
  }
}
