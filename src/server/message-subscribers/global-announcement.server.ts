import { MessagingService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { MessagingTopic } from "server/constants";
import { Events } from "server/networking";

const MessageSchema = t.strictInterface({
  text: t.string,
  duration: t.optional(t.number),
});

MessagingService.SubscribeAsync(MessagingTopic.GlobalAnnouncement, message => {
  const data = message.Data;

  if (!MessageSchema(data)) {
    return;
  }

  Events.announce.broadcast(data.text, data.duration);
});

MessagingService.SubscribeAsync(MessagingTopic.ClearAnnouncements, () => {
  Events.clearAnnouncements.broadcast();
});
