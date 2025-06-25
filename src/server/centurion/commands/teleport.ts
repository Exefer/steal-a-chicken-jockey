import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { CustomArgumentType } from "shared/centurion/types";
import { getHumanoidRootPart } from "shared/utils/humanoid";

@Register()
export class TeleportCommand {
  @Command({
    name: "teleport",
    description: "Teleports a player or set of players to one target",
    arguments: [
      {
        name: "players",
        description: "The players to teleport",
        type: CenturionType.Players,
      },
      {
        name: "to",
        description: "The player or position to teleport to",
        type: CustomArgumentType.PlayerOrVector3,
      },
    ],
  })
  @Guard(isAdmin)
  teleport(ctx: CommandContext, players: Player[], to: Player | Vector3) {
    if (typeIs(to, "Instance") && classIs(to, "Player")) {
      if (!to.Character) return;
      for (const player of players) {
        if (!player.Character) return;
        getHumanoidRootPart(player.Character)!.CFrame = getHumanoidRootPart(to.Character)!.CFrame;
      }
      return;
    }

    for (const player of players) {
      if (!player.Character) return;
      getHumanoidRootPart(player.Character)!.CFrame = new CFrame(to);
    }
  }
}
