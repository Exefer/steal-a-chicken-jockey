import { CreateVideStory, InferVideProps } from "@rbxts/ui-labs";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { StoryCreation } from "@rbxts/ui-labs/src/Typing/Typing";
import Vide from "@rbxts/vide";

export function quickStory<T extends ReturnControls>(controls: T, render: StoryCreation<InferVideProps<T>, Vide.Node>) {
  return CreateVideStory({ controls, vide: Vide }, render);
}
