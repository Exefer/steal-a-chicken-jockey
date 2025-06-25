import { CenturionType, Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { CharacterSpawnerService } from "server/services/character-spawner-service";

@Register({
  groups: [
    {
      name: "spawnboost",
      description: "Commands to manage the server's spawn rate boost",
      parent: ["server"],
    },
  ],
})
@Group("server", "spawnboost")
export class BoostCommand {
  @Command({
    name: "set",
    description: "Sets the server's spawn rate boost",
    arguments: [
      {
        name: "multiplier",
        description: "The multiplier value",
        type: CenturionType.Number,
        suggestions: ["1", "2", "4"],
      },
    ],
  })
  @Guard(isAdmin)
  set(ctx: CommandContext, multiplier: number): void {
    if (!CharacterSpawnerService.BOOST_LEVELS.has(multiplier)) {
      ctx.reply("Invalid multiplier");
      return;
    }

    CharacterSpawnerService.setBoostLevel(multiplier);
    ctx.reply(`Spawn rate boost set to ${multiplier}x`);
  }
}
