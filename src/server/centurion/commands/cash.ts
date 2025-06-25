import { CenturionType, Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { Leaderstats } from "server/modules/leaderstats";
import { PlayerSessionService } from "server/services/player-session-service";

@Register({
  groups: [
    {
      name: "cash",
      description: "Commands related to in-game cash",
    },
  ],
})
@Group("cash")
export class CashCommand {
  @Command({
    name: "set",
    description: "Set the cash of a player",
    arguments: [
      {
        name: "player",
        description: "The player to set the cash of",
        type: CenturionType.Player,
      },
      {
        name: "amount",
        description: "The amount of cash to set",
        type: CenturionType.Number,
      },
    ],
  })
  @Guard(isAdmin)
  set(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Cash = amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Cash: result.Gameplay.Cash,
    });
  }

  @Command({
    name: "add",
    description: "Add cash to a player",
    arguments: [
      {
        name: "player",
        description: "The player to add cash to",
        type: CenturionType.Player,
      },
      {
        name: "amount",
        description: "The amount of cash to add",
        type: CenturionType.Number,
      },
    ],
  })
  @Guard(isAdmin)
  add(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Cash += amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Cash: result.Gameplay.Cash,
    });
  }
}
