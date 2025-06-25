import Vide from "@rbxts/vide";
import { Text } from "../ui/text";

interface AnnouncementProps {
  readonly text: string;
}

export function Announcement(props: AnnouncementProps) {
  return (
    <Text
      text={props.text}
      anchorPoint={new Vector2(0.5, 0.5)}
      size={new UDim2(0.6, 0, 0, 30)}
      textSize={30}
      backgroundTransparency={1}
      textColor={Color3.fromRGB(255, 255, 255)}
    >
      <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={1.5} />
    </Text>
  );
}
