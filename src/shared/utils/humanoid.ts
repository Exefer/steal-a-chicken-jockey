import { Players } from "@rbxts/services";

export function getHumanoidRootPart(instance: Instance): BasePart | undefined {
  return instance.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
}

export function moveTo(humanoid: Humanoid, targetPoint: Vector3, andThen?: () => void) {
  let targetReached = false;

  let connection: RBXScriptConnection | undefined;

  connection = humanoid.MoveToFinished.Connect(reached => {
    targetReached = reached;
    connection?.Disconnect();
    connection = undefined;
    if (andThen) andThen();
  });

  humanoid.MoveTo(targetPoint);

  task.spawn(() => {
    while (!targetReached) {
      if (!humanoid || !humanoid.Parent) break;
      if (humanoid.WalkToPoint !== targetPoint) break;

      humanoid.MoveTo(targetPoint);
      task.wait(6);
    }
    if (!connection) return;

    connection.Disconnect();
    connection = undefined;
  });
}

export function getPlayerFromPart(part: BasePart): Player | undefined {
  const character = part.Parent;
  if (!character?.FindFirstChildOfClass("Humanoid")) return;

  return Players.GetPlayerFromCharacter(character);
}
