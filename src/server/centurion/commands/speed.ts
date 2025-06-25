import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";

@Register()
export class SpeedCommand {
  @Command({
    name: "speed",
    description: "Sets a player's speed",
    arguments: [
      {
        name: "player",
        description: "The player to set the speed of",
        type: CenturionType.Player,
      },
      {
        name: "speed",
        description: "The speed to set",
        type: CenturionType.Number,
      },
    ],
  })
  @Guard(isAdmin)
  speed(ctx: CommandContext, player: Player, speed: number) {
    const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
    if (!humanoid) {
      ctx.error(`${player.Name} does not have a Humanoid`);
      return;
    }

    humanoid.WalkSpeed = speed;
    ctx.reply(`Successfully changed speed for ${player.Name}`);
  }
}
