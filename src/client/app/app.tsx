import Vide from "@rbxts/vide";
import { Alerts } from "client/ui/components/alerts";
import { Announcements } from "client/ui/components/announcements";
import { Layer } from "client/ui/components/ui/layer";

export function App() {
  return (
    <>
      <Layer>
        <Announcements />
      </Layer>
      <Layer>
        <Alerts />
      </Layer>
    </>
  );
}
