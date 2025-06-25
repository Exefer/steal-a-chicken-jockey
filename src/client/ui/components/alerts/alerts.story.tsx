import Vide from "@rbxts/vide";
import { Alert, Alerts } from "client/ui/components/alerts";
import { quickStory } from "client/ui/utils/quick-story";

export = quickStory({}, props => {
  return (
    <Alerts>
      <Alert text="💡 This alert uses rich <s><u>text</u></s> formatting!" type="info" />
      <Alert
        text="<font color='#00FF00' size='24'>🔥 This</font> alert uses <b>bold</b> rich <s><u>text</u></s>"
        type="error"
      />
      <Alert text="📢 This is a <b>normal</b> alert with emphasis" type="info" />
      <Alert text="❌ This is a <font color='#FF6B6B'>critical</font> alert" type="error" />
      <Alert text="This is an alert" type="info" />
      <Alert text="This is an alert" type="error" />
    </Alerts>
  );
});
