import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";

@Register()
export class KillCommand {
  @Command({
    name: "kill",
    description: "Kills a player",
    arguments: [
      {
        name: "player",
        description: "The player to kill",
        type: CenturionType.Player,
      },
    ],
  })
  @Guard(isAdmin)
  kill(ctx: CommandContext, player: Player) {
    const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
    if (!humanoid) {
      ctx.error(`${player.Name} does not have a Humanoid`);
      return;
    }

    humanoid.Health = 0;
    ctx.reply(`Successfully killed ${player.Name}`);
  }
}
