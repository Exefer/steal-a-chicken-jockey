import { Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { Leaderstats } from "server/modules/leaderstats";
import { PlayerSessionService } from "server/services/player-session-service";

@Register({
  groups: [
    {
      name: "steals",
      description: "Commands related to in-game steals",
    },
  ],
})
@Group("steals")
export class StealsCommand {
  @Command({
    name: "set",
    description: "Set the steals of a player",
    arguments: [
      {
        name: "player",
        description: "The player to set the steals of",
        type: "player",
      },
      {
        name: "amount",
        description: "The amount of steals to set",
        type: "number",
      },
    ],
  })
  @Guard(isAdmin)
  set(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Steals = amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Steals: result.Gameplay.Steals,
    });
  }

  @Command({
    name: "add",
    description: "Add steals to a player",
    arguments: [
      {
        name: "player",
        description: "The player to add steals to",
        type: "player",
      },
      {
        name: "amount",
        description: "The amount of steals to add",
        type: "number",
      },
    ],
  })
  @Guard(isAdmin)
  add(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Steals += amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Steals: result.Gameplay.Steals,
    });
  }
}
