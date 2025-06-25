import { atom } from "@rbxts/charm";

export interface Announcement {
  id: number;
  text: string;
}

export const announcements = atom<Announcement[]>([]);

let nextId = 0;

export function addAnnouncement(text: string, duration: number = 10) {
  const id = nextId++;
  announcements(state => [...state, { id, text }]);

  task.delay(duration, () => {
    removeAnnouncement(id);
  });
}

export function removeAnnouncement(id: number) {
  announcements(state => state.filter(a => a.id !== id));
}
export function clearAnnouncements() {
  announcements(() => []);
}
