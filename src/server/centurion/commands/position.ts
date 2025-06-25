import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { getHumanoidRootPart } from "shared/utils/humanoid";

@Register()
export class PositionCommand {
  @Command({
    name: "position",
    description: "Returns Vector3 position of you or other players",
    arguments: [
      {
        name: "player",
        description: "The player to report the position of",
        type: CenturionType.Player,
      },
    ],
    aliases: ["pos"],
  })
  @Guard(isAdmin)
  position(ctx: CommandContext, player: Player | undefined) {
    player = player ?? ctx.executor;
    if (!player.Character) {
      ctx.error(`${player.Name} has no character`);
      return;
    }

    const root = getHumanoidRootPart(player.Character);

    ctx.reply(tostring(root?.Position).gsub("%s", "")[0] || "No position found");
  }
}
