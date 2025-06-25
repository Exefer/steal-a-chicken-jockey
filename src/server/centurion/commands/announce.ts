import { CenturionType, Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { MessagingService } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";
import { MessagingTopic } from "server/constants";
import { Events } from "server/networking";

@Register()
export class AnnounceCommand {
  @Command({
    name: "announce",
    description: "Makes a global-wide announcement",
    arguments: [
      {
        name: "text",
        description: "The announcement text",
        type: CenturionType.String,
      },
      {
        name: "duration",
        description: "The announcement duration in seconds",
        type: CenturionType.Number,
        optional: true,
      },
    ],
  })
  @Guard(isAdmin)
  @Group("global")
  announceGlobal(ctx: CommandContext, text: string, duration?: number) {
    MessagingService.PublishAsync(MessagingTopic.GlobalAnnouncement, { text, duration });
  }

  @Command({
    name: "announce",
    description: "Makes a server-wide announcement",
    arguments: [
      {
        name: "text",
        description: "The announcement text",
        type: CenturionType.String,
      },
      {
        name: "duration",
        description: "The announcement duration in seconds",
        type: CenturionType.Number,
        optional: true,
      },
    ],
  })
  @Guard(isAdmin)
  @Group("server")
  announceServer(ctx: CommandContext, announcement: string, duration?: number) {
    Events.announce.broadcast(announcement, duration);
  }
}
