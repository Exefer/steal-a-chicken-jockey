import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { TeleportService } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";

/*
 * NOTE: The documentation for this method was poorly written
 * https://create.roblox.com/docs/reference/engine/classes/TeleportService#GetPlayerPlaceInstanceAsync
 */

@Register()
export class JoinCommand {
  @Command({
    name: "join",
    description: "Join the player of a specific user id",
    arguments: [
      {
        name: "userId",
        description: "The user id of the player to join",
        type: CenturionType.Number,
      },
    ],
  })
  @Guard(isAdmin)
  join(ctx: CommandContext, userId: number) {
    const [currentInstance, errorMessage, _, placeId, instanceId] = pcall(() =>
      TeleportService.GetPlayerPlaceInstanceAsync(userId)
    );

    print(currentInstance);
    print(errorMessage);
    print(_);
    print(placeId);
    print(instanceId);

    if (currentInstance) {
      ctx.error(`${userId} is already in the game!`);
      return;
    }

    if (errorMessage) {
      ctx.error(errorMessage as string);
      return;
    }

    TeleportService.TeleportToPlaceInstance(placeId!, instanceId!, ctx.executor);
  }
}
