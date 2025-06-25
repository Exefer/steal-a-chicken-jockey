import { Players } from "@rbxts/services";
import { mount } from "@rbxts/vide";
import { Events } from "client/networking";
import { addAlert } from "client/store/alerts";
import { addAnnouncement, clearAnnouncements } from "client/store/annoucements";
import { App } from "./app";

Events.announce.connect((announcement, duration) => {
  addAnnouncement(announcement, duration);
});

Events.clearAnnouncements.connect(() => {
  clearAnnouncements();
});

Events.alert.connect((alert, duration) => {
  addAlert(alert, duration);
});

const target = Players.LocalPlayer.WaitForChild("PlayerGui");

mount(App, target);
