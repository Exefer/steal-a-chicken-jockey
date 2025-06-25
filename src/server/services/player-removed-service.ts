import { Modding, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { OnPlayerRemoved } from "server/listeners";

@Service()
export class PlayerRemovedService implements OnStart {
  onStart() {
    const listeners = new Set<OnPlayerRemoved>();

    Modding.onListenerAdded<OnPlayerRemoved>(object => listeners.add(object));
    Modding.onListenerRemoved<OnPlayerRemoved>(object => listeners.delete(object));

    Players.PlayerRemoving.Connect(player => {
      for (const listener of listeners) {
        task.spawn(() => listener.onPlayerRemoved(player));
      }
    });

    for (const player of Players.GetPlayers()) {
      for (const listener of listeners) {
        task.spawn(() => listener.onPlayerRemoved(player));
      }
    }
  }
}
