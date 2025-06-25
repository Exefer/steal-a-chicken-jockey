import Vide, { Show } from "@rbxts/vide";
import { Text } from "../ui/text";

interface LockStatusProps {
  lockTime: Vide.Source<number>;
}

export function LockStatus(props: LockStatusProps) {
  const text = () => (props.lockTime() ? "Locked:" : "Lock Base");
  const textColor = () => (props.lockTime() ? Color3.fromRGB(255, 0, 0) : Color3.fromRGB(255, 255, 0));

  return (
    <Vide.Fragment>
      <Text
        text={text}
        anchorPoint={new Vector2(0.5, 0.5)}
        textSize={24}
        textColor={textColor}
        size={new UDim2(1, 0, 0, 24)}
      >
        <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={2} />
      </Text>
      <Show when={() => props.lockTime() > 0}>
        {() => (
          <Text
            text={() => `${props.lockTime()} seconds`}
            textSize={20}
            textColor={Color3.fromRGB(255, 255, 255)}
            size={new UDim2(1, 0, 0, 20)}
          >
            <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={1} />
          </Text>
        )}
      </Show>
      <uilistlayout
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
        VerticalAlignment={Enum.VerticalAlignment.Center}
      />
    </Vide.Fragment>
  );
}
