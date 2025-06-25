import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";

@Register()
export class KickCommand {
  @Command({
    name: "kick",
    description: "Kicks a player",
    arguments: [
      {
        name: "player",
        description: "The player to kick",
        type: CenturionType.Player,
      },
    ],
  })
  @Guard(isAdmin)
  kick(ctx: CommandContext, player: Player): void {
    player.Kick("You have been kicked from the server.");
    ctx.reply(`Successfully kicked ${player.Name}`);
  }
}
