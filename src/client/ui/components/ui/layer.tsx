import Vide from "@rbxts/vide";

interface LayerProps extends Vide.PropsWithChildren {
  displayOrder?: number;
}

export function Layer({ displayOrder, children }: LayerProps) {
  return (
    <screengui ResetOnSpawn={false} DisplayOrder={displayOrder} IgnoreGuiInset ZIndexBehavior="Sibling">
      {children}
    </screengui>
  );
}
