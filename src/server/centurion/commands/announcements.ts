/* import { Command, CommandContext, Group, Guard, Register } from "@rbxts/centurion";
import { MessagingService } from "@rbxts/services";
import { isAdmin } from "server/centurion/guards";
import { MessagingTopic } from "server/constants";
import { Events } from "server/networking";


@Register({
  groups: [
    {
      name: "announcements",
      description: "Announcement commands",
      parent: ["server", "global"],
    },
  ],
})
export class AnnouncementCommand {
  @Command({
    name: "clear",
    description: "Clears server-wide announcements",
  })
  @Guard(isAdmin)
  @Group("server", "announcements")
  clearAnnouncementsServer(ctx: CommandContext) {
    Events.clearAnnouncements.broadcast();
    ctx.reply("Server announcements cleared");
  }

  @Command({
    name: "clear",
    description: "Clears global-wide announcements",
  })
  @Guard(isAdmin)
  @Group("global", "announcements")
  clearAnnouncementsGlobal(ctx: CommandContext) {
    MessagingService.PublishAsync(MessagingTopic.ClearAnnouncements, undefined);
    ctx.reply("Global announcements cleared");
  }
}
 */
