import Vide from "@rbxts/vide";
import { alerts } from "client/store/alerts";
import { useAtom } from "client/ui/composables/use-atom";
import { Alert } from "./alert";

export interface AlertsProps extends Vide.PropsWithChildren {}

export function Alerts(props: AlertsProps) {
  const alertsAtom = useAtom(alerts);

  return (
    <Vide.Fragment>
      {Vide.values(alertsAtom, alert => (
        <Alert {...alert} />
      ))}
      {props.children}
      <uipadding PaddingBottom={new UDim(0.1, 0)} />
      <uilistlayout
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
        VerticalAlignment={Enum.VerticalAlignment.Bottom}
      />
    </Vide.Fragment>
  );
}
