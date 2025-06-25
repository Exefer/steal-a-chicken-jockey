import { atom } from "@rbxts/charm";
import { SharedAlert } from "shared/types";

export interface Alert extends SharedAlert {
  id: number;
}

export const alerts = atom<Alert[]>([]);

let nextId = 0;

export function addAlert(alert: SharedAlert, duration: number = 5) {
  const id = nextId++;
  alerts(state => [...state, { ...alert, id }]);

  task.delay(duration, () => {
    removeAlert(id);
  });
}

export function removeAlert(id: number) {
  alerts(state => state.filter(a => a.id !== id));
}
export function clearAlerts() {
  alerts(() => []);
}
