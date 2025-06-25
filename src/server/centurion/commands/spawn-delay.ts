import { CenturionType, Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { CharacterSpawnerService } from "server/services/character-spawner-service";

@Register({
  groups: [
    {
      name: "spawndelay",
      description: "Commands to manage the server's spawns delay",
      parent: ["server"],
    },
  ],
})
@Group("server", "spawndelay")
export class SpawnDelayCommand {
  @Command({
    name: "set",
    description: "Sets the server's spawns delay",
    arguments: [
      {
        name: "delay",
        description: "The delay in seconds",
        type: CenturionType.Number,
        suggestions: ["5", "10", "15", "20"],
      },
    ],
  })
  @Guard(isAdmin)
  set(ctx: CommandContext, delay: number): void {
    if (delay < 1) {
      ctx.error("Invalid delay");
      return;
    }
    CharacterSpawnerService.setSpawnDelay(delay);
    ctx.reply(`Spawns delay set to ${delay}s`);
  }
}
