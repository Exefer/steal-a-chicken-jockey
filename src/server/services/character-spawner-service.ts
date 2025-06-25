import { OnStart, Service } from "@flamework/core";
import { PhysicsService, ServerStorage, Workspace } from "@rbxts/services";
import RandomPicker from "@rbxts/weighted-random-picker";
import { CollisionGroup, Tag } from "shared/constants/game";
import { getLogger } from "shared/utils/setup-logger";

@Service()
export class CharacterSpawnerService implements OnStart {
  private readonly logger = getLogger();
  public static readonly BOOST_LEVELS = new Set([1, 2, 4]);
  private static readonly BASE_RATES = [86.2, 10, 2, 0.7, 0.1];
  private static readonly BOOST_MULTIPLIERS = [0.8, 1.5, 2, 2, 2];
  private static readonly RARITY_NAMES = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
  private static readonly CHARACTERS_BY_RARITY = new Map<string, Array<Model>>();
  private static readonly PICKERS = new Map<number, RandomPicker<string>>();
  private static currentBoost = 1;
  private static spawnDelay = 4;

  static {
    // Initialize pickers
    this.PICKERS.set(1, new RandomPicker(this.RARITY_NAMES, this.BASE_RATES));
    this.PICKERS.set(2, new RandomPicker(this.RARITY_NAMES, this.calculateBoostedRates(this.BASE_RATES)));
    this.PICKERS.set(
      4,
      new RandomPicker(this.RARITY_NAMES, this.calculateBoostedRates(this.calculateBoostedRates(this.BASE_RATES)))
    );

    // Initialize character maps
    this.RARITY_NAMES.forEach(rarity => {
      this.CHARACTERS_BY_RARITY.set(rarity, ServerStorage.Characters.WaitForChild(rarity).GetChildren() as Model[]);
    });
  }

  public onStart(): void {
    this.setupCollisionGroups();
    this.startSpawning();
    this.setupCharacterDespawnerTouchHandler();
  }

  private setupCollisionGroups(): void {
    PhysicsService.RegisterCollisionGroup(CollisionGroup.ChickenJockeys);
    PhysicsService.RegisterCollisionGroup(CollisionGroup.PlayerCharacters);
    PhysicsService.CollisionGroupSetCollidable(CollisionGroup.ChickenJockeys, CollisionGroup.ChickenJockeys, false);
    PhysicsService.CollisionGroupSetCollidable(CollisionGroup.ChickenJockeys, CollisionGroup.PlayerCharacters, false);
  }

  private setupCharacterDespawnerTouchHandler(): void {
    Workspace.CharacterDespawnPart.Touched.Connect(otherPart => {
      const model = otherPart.FindFirstAncestorWhichIsA("Model");
      if (!model || !model.HasTag(Tag.Character)) return;
      model.Destroy();
    });
  }

  private startSpawning(): thread {
    return task.spawn(() => {
      while (task.wait(CharacterSpawnerService.spawnDelay)) {
        const rarity = this.pickRarity();
        const characters = CharacterSpawnerService.CHARACTERS_BY_RARITY.get(rarity)!;
        const character = characters[math.random(0, characters.size() - 1)];

        this.cloneCharacter(character);
        // this.logger.Debug(`Spawning ${rarity} character (Boost: ${CharacterSpawnerService.currentBoost}x)`);
      }
    });
  }

  public static setBoostLevel(level: number): void {
    if (!this.BOOST_LEVELS.has(level)) {
      warn(`Invalid boost level: ${level}`);
      return;
    }
    this.currentBoost = level;
  }

  public static setSpawnDelay(delay: number): void {
    this.spawnDelay = math.max(1, delay);
  }

  private static calculateBoostedRates(baseRates: number[] = this.BASE_RATES): number[] {
    const boosted = baseRates.map((rate, i) => rate * this.BOOST_MULTIPLIERS[i]);
    const total = boosted.reduce((sum, rate) => sum + rate, 0);
    return boosted.map(rate => (rate / total) * 100);
  }

  private pickRarity(): string {
    return (
      CharacterSpawnerService.PICKERS.get(CharacterSpawnerService.currentBoost) ||
      CharacterSpawnerService.PICKERS.get(1)!
    )();
  }

  private cloneCharacter(character: Model): Model {
    const clone = character.Clone();
    clone.Parent = Workspace;
    clone.SetAttribute("Rarity", character.Parent?.Name);
    return clone;
  }

  public static cloneCharacterByName(name: string): Model {
    const character = ServerStorage.Characters.FindFirstChild(name, true) as Model;
    const clone = character?.Clone();
    clone?.SetAttribute("Rarity", character.Parent?.Name);
    return clone;
  }
}
