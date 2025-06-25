import Vide from "@rbxts/vide";
import { announcements } from "client/store/annoucements";
import { useAtom } from "client/ui/composables/use-atom";
import { Announcement } from "./announcement";

export interface AnnouncementsProps extends Vide.PropsWithChildren {}

export function Announcements(props: AnnouncementsProps) {
  const announcementsAtom = useAtom(announcements);

  return (
    <Vide.Fragment>
      {Vide.values(announcementsAtom, announcement => (
        <Announcement text={announcement.text} />
      ))}
      {props.children}
      <uipadding PaddingTop={new UDim(0.05, 0)} />
      <uilistlayout
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
      />
    </Vide.Fragment>
  );
}
