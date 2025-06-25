import Vide from "@rbxts/vide";
import { quickStory } from "client/ui/utils/quick-story";
import { LockStatus } from "./lock-status";

export = quickStory<{ lockTime: number }>({ lockTime: 0 }, props => {
  return <LockStatus lockTime={props.controls.lockTime} />;
});
