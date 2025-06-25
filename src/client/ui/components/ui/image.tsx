import Vide from "@rbxts/vide";
import { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
  image: string;
  imageColor?: Color3 | Vide.Source<Color3>;
  imageTransparency?: number | Vide.Source<number>;
  imageRectOffset?: Vector2 | Vide.Source<Vector2>;
  imageRectSize?: Vector2 | Vide.Source<Vector2>;
  scaleType?: Vide.InferEnumNames<Enum.ScaleType>;
  sliceScale?: number | Vide.Source<number>;
  sliceCenter?: Rect | Vide.Source<Rect>;
  tileSize?: UDim2 | Vide.Source<UDim2>;
}

export function Image(props: ImageProps) {
  return (
    <imagelabel
      Image={props.image}
      ImageColor3={props.imageColor}
      ImageTransparency={props.imageTransparency}
      ImageRectOffset={props.imageRectOffset}
      ImageRectSize={props.imageRectSize}
      ScaleType={props.scaleType}
      SliceScale={props.sliceScale}
      SliceCenter={props.sliceCenter}
      TileSize={props.tileSize}
      Size={props.size}
      Position={props.position}
      AnchorPoint={props.anchorPoint}
      Rotation={props.rotation}
      BackgroundColor3={props.backgroundColor}
      BackgroundTransparency={props.backgroundTransparency ?? 1}
      ClipsDescendants={props.clipsDescendants}
      Visible={props.visible}
      ZIndex={props.zIndex}
      LayoutOrder={props.layoutOrder}
      BorderSizePixel={0}
      {...props.event}
      {...props.change}
    >
      {props.children}
      {props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
    </imagelabel>
  );
}
