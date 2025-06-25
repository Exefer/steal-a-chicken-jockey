import { Events } from "server/networking";
import { DevProductPlayerAttribute } from "shared/assets";

Events.unlockBase.connect((player, victim) => {
  player.SetAttribute(DevProductPlayerAttribute.UnlockBase, victim.UserId);
});
