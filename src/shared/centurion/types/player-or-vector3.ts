import { TransformResult, TypeBuilder } from "@rbxts/centurion";
import { Players } from "@rbxts/services";
import { CustomArgumentType } from ".";

function textToVector3(text: string): Vector3 | undefined {
  const parts = text.split(",");

  if (parts.size() !== 3) return;

  for (const part of parts) {
    if (!tonumber(part)) return;
  }

  return new Vector3(...(parts as unknown as [number, number, number]));
}

export const playerOrVector3Type = TypeBuilder.create<Player | Vector3>(CustomArgumentType.PlayerOrVector3)
  .transform((text, executor) => {
    if (text === "@me") {
      return TransformResult.ok(executor);
    }

    const position = textToVector3(text);
    if (position) {
      return TransformResult.ok(position);
    }

    const player = Players.FindFirstChild(text);
    if (player === undefined || !classIs(player, "Player")) {
      return TransformResult.err("Player not found");
    }
    return TransformResult.ok(player);
  })
  .suggestions(() => Players.GetPlayers().map(player => player.Name))
  .markForRegistration()
  .build();
