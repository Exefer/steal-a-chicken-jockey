import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { Players } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";
import { ADMIN_IDS, BAN_REASONS } from "shared/centurion/constants";

@Register()
export class TempBanCommand {
  @Command({
    name: "tempban",
    description: "Temporarely bans a player",
    arguments: [
      {
        name: "player",
        description: "The player to ban",
        type: CenturionType.Player,
      },
      {
        name: "duration ",
        description: "The duration of the ban",
        type: CenturionType.Duration,
        suggestions: ["1d", "3d", "1w", "1m", "1y"],
      },
      {
        name: "reason",
        description: "The reason for the ban",
        type: CenturionType.String,
        suggestions: BAN_REASONS,
      },
      {
        name: "reason",
        description: "The private reason for the ban",
        type: CenturionType.String,
        optional: true,
      },
    ],
    aliases: ["timeban"],
  })
  @Guard(isAdmin)
  tempban(ctx: CommandContext, player: Player, duration: number, reason: string, privateReason?: string) {
    if (ADMIN_IDS.has(player.UserId)) {
      ctx.error("You can't ban an admin!");
      return;
    }

    Players.BanAsync({
      ApplyToUniverse: true,
      UserIds: [player.UserId],
      Duration: duration,
      DisplayReason: reason,
      PrivateReason: privateReason ?? reason,
      ExcludeAltAccounts: false,
    });
  }
}
