import Vide from "@rbxts/vide";
import { fonts } from "client/constants/fonts";
import { FrameProps } from "./frame";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
  /* font?: Font; */
  text?: string | Vide.Source<string>;
  textColor?: Color3 | Vide.Source<Color3>;
  textSize?: number | Vide.Source<number>;
  textTransparency?: number | Vide.Source<number>;
  textWrapped?: boolean | Vide.Source<boolean>;
  textXAlignment?: Vide.InferEnumNames<Enum.TextXAlignment>;
  textYAlignment?: Vide.InferEnumNames<Enum.TextYAlignment>;
  textTruncate?: Vide.InferEnumNames<Enum.TextTruncate>;
  textScaled?: boolean | Vide.Source<boolean>;
  textHeight?: number | Vide.Source<number>;
  textAutoResize?: "X" | "Y" | "XY";
  richText?: boolean | Vide.Source<boolean>;
  maxVisibleGraphemes?: number | Vide.Source<number>;
}

export function Text(props: TextProps) {
  return (
    <textlabel
      Font={fonts.inter.regular}
      Text={props.text}
      TextColor3={props.textColor}
      TextSize={props.textSize}
      TextTransparency={props.textTransparency}
      TextWrapped={props.textWrapped}
      TextXAlignment={props.textXAlignment}
      TextYAlignment={props.textYAlignment}
      TextTruncate={props.textTruncate}
      TextScaled={props.textScaled}
      LineHeight={props.textHeight}
      RichText={props.richText}
      MaxVisibleGraphemes={props.maxVisibleGraphemes}
      Size={props.size}
      AutomaticSize={props.textAutoResize}
      Position={props.position}
      AnchorPoint={props.anchorPoint}
      BackgroundColor3={props.backgroundColor}
      BackgroundTransparency={props.backgroundTransparency ?? 1}
      ClipsDescendants={props.clipsDescendants}
      Visible={props.visible}
      ZIndex={props.zIndex}
      LayoutOrder={props.layoutOrder}
      {...props.change}
      {...props.event}
    >
      {props.children}
      {props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
    </textlabel>
  );
}
