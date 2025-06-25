import Vide from "@rbxts/vide";
import { Text } from "../ui/text";

interface AlertProps {
  readonly text: string;
  readonly type: "error" | "info";
}

const ALERT_COLORS = {
  error: Color3.fromRGB(255, 0, 0),
  info: Color3.fromRGB(255, 255, 255),
};

export function Alert(props: AlertProps) {
  const textColor = ALERT_COLORS[props.type];
  return (
    <Text
      text={props.text}
      anchorPoint={new Vector2(0.5, 0.5)}
      size={new UDim2(0.6, 0, 0, 36)}
      textSize={36}
      backgroundTransparency={1}
      textColor={textColor}
      richText
    >
      <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={1.5} />
    </Text>
  );
}
