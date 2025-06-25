import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { Players } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";
import { ADMIN_IDS, BAN_REASONS } from "shared/centurion/constants";

@Register()
export class BanCommand {
  @Command({
    name: "ban",
    description: "Bans a player",
    arguments: [
      {
        name: "player",
        description: "Player to ban",
        type: CenturionType.Player,
      },
      {
        name: "reason",
        description: "Reason for the ban",
        type: CenturionType.String,
        suggestions: BAN_REASONS,
      },
    ],
    aliases: ["permban"],
  })
  @Guard(isAdmin)
  ban(ctx: CommandContext, player: Player, reason: string, privateReason?: string) {
    if (ADMIN_IDS.has(player.UserId)) {
      ctx.error("You can't ban an admin!");
      return;
    }

    Players.BanAsync({
      ApplyToUniverse: true,
      UserIds: [player.UserId],
      Duration: -1,
      DisplayReason: reason,
      PrivateReason: privateReason ?? reason,
      ExcludeAltAccounts: false,
    });
  }
}
