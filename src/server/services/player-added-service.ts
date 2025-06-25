import { Modding, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { OnPlayerAdded } from "server/listeners";

@Service()
export class PlayerAddedService implements OnStart {
  onStart() {
    const listeners = new Set<OnPlayerAdded>();

    Modding.onListenerAdded<OnPlayerAdded>(object => listeners.add(object));
    Modding.onListenerRemoved<OnPlayerAdded>(object => listeners.delete(object));

    Players.PlayerAdded.Connect(player => {
      for (const listener of listeners) {
        task.spawn(() => listener.onPlayerAdded(player));
      }
    });

    for (const player of Players.GetPlayers()) {
      for (const listener of listeners) {
        task.spawn(() => listener.onPlayerAdded(player));
      }
    }
  }
}
