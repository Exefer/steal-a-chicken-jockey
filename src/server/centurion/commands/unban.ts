import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { Players } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";

@Register()
export class BanCommand {
  @Command({
    name: "unban",
    description: "Unbans a player",
    arguments: [
      {
        name: "userId",
        description: "The user ID of the player to unban",
        type: CenturionType.Number,
      },
    ],
    aliases: ["sban"],
  })
  @Guard(isAdmin)
  unban(ctx: CommandContext, userId: number) {
    Players.UnbanAsync({
      ApplyToUniverse: true,
      UserIds: [userId],
    });
  }
}
