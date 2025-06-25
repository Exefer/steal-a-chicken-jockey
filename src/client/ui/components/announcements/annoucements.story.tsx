import Vide from "@rbxts/vide";
import { Announcement, Announcements } from "client/ui/components/announcements";
import { quickStory } from "client/ui/utils/quick-story";

export = quickStory({}, props => {
  return (
    <Announcements>
      <Announcement text="Announcement" />
    </Announcements>
  );
});
