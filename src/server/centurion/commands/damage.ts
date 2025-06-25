import { CenturionType, Command, CommandContext, Guard, Register } from "@rbxts/centurion";
import { isAdmin } from "server/centurion/guards";

@Register()
export class DamageCommand {
  @Command({
    name: "damage",
    description: "Damages a player",
    arguments: [
      {
        name: "player",
        description: "The player to damage",
        type: CenturionType.Player,
      },
      {
        name: "damage",
        description: "The amount to damage the player",
        type: CenturionType.Number,
      },
    ],
    aliases: ["dmg"],
  })
  @Guard(isAdmin)
  damage(ctx: CommandContext, player: Player, damage: number) {
    if (!player.Character) {
      ctx.error("Player's character does not exist");
      return;
    }

    const humanoid = player.Character.FindFirstChildOfClass("Humanoid");
    if (!humanoid) {
      ctx.error("Player's humanoid does not exist");
      return;
    }

    if (humanoid.Health === 0) {
      ctx.error("Player is already dead");
      return;
    }

    humanoid.Health -= damage;
    ctx.reply(`Damaged <b>${player.Name}</b> for <b>${damage}</b> HP`);
  }
}
