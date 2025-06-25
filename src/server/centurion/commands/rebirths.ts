import { Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";
import { Leaderstats } from "server/modules/leaderstats";
import { PlayerSessionService } from "server/services/player-session-service";

@Register({
  groups: [
    {
      name: "rebirths",
      description: "Commands related to in-game rebirths",
    },
  ],
})
@Group("rebirths")
export class RebirthsCommand {
  @Command({
    name: "set",
    description: "Set the rebirths of a player",
    arguments: [
      {
        name: "player",
        description: "The player to set the rebirths of",
        type: "player",
      },
      {
        name: "amount",
        description: "The amount of rebirths to set",
        type: "number",
      },
    ],
  })
  @Guard(isAdmin)
  set(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Rebirths = amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Rebirths: result.Gameplay.Rebirths,
    });
  }

  @Command({
    name: "add",
    description: "Add rebirths to a player",
    arguments: [
      {
        name: "player",
        description: "The player to add rebirths to",
        type: "player",
      },
      {
        name: "amount",
        description: "The amount of rebirths to add",
        type: "number",
      },
    ],
  })
  @Guard(isAdmin)
  add(ctx: CommandContext, player: Player, amount: number): void {
    const result = PlayerSessionService.updateProfile(player, data => {
      data.Gameplay.Rebirths += amount;
      return data;
    });

    Leaderstats.updateValues(player, {
      Rebirths: result.Gameplay.Rebirths,
    });
  }
}
