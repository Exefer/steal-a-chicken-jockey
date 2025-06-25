import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";

@Register()
export class RespawnCommand {
  @Command({
    name: "respawn",
    description: "Respawns a player or a group of players",
    arguments: [
      {
        name: "players",
        description: "The players to respawn",
        type: CenturionType.Players,
      },
    ],
    aliases: ["refresh"],
  })
  @Guard(isAdmin)
  respawn(ctx: CommandContext, players: Player[]) {
    for (const player of players) {
      player.LoadCharacter();
    }
    ctx.reply(`Respawned ${players.size()} players`);
  }
}
