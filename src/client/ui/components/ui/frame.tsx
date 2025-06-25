import Vide from "@rbxts/vide";

export interface FrameProps<T extends Instance = Frame> extends Vide.PropsWithChildren {
  event?: Vide.InstanceEventCallbacks<T>;
  change?: Vide.InstanceChangedCallbacks<T>;
  size?: UDim2 | Vide.Source<UDim2>;
  position?: UDim2 | Vide.Source<UDim2>;
  anchorPoint?: Vector2 | Vide.Source<Vector2>;
  rotation?: number | Vide.Source<number>;
  backgroundColor?: Color3 | Vide.Source<Color3>;
  backgroundTransparency?: number | Vide.Source<number>;
  clipsDescendants?: boolean | Vide.Source<boolean>;
  visible?: boolean | Vide.Source<boolean>;
  zIndex?: number | Vide.Source<number>;
  layoutOrder?: number | Vide.Source<number>;
  cornerRadius?: UDim | Vide.Source<UDim>;
}

export function Frame(props: FrameProps) {
  return (
    <frame
      Size={props.size}
      Position={props.position}
      AnchorPoint={props.anchorPoint}
      Rotation={props.rotation}
      BackgroundColor3={props.backgroundColor}
      BackgroundTransparency={props.backgroundTransparency}
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
    </frame>
  );
}
