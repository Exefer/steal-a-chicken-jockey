import { Controller, Modding, OnStart } from "@flamework/core";
import { OnCharacterSpawned } from "client/listeners";
import { Events } from "client/networking";

@Controller()
export class OnCharacterSpawnedController implements OnStart {
  public onStart(): void {
    const listeners = new Set<OnCharacterSpawned>();

    Modding.onListenerAdded<OnCharacterSpawned>(object => listeners.add(object));
    Modding.onListenerRemoved<OnCharacterSpawned>(object => listeners.delete(object));

    Events.characterSpawned.connect(checkpointIndex => {
      for (const listener of listeners) {
        task.spawn(() => listener.onCharacterSpawned(checkpointIndex));
      }
    });
  }
}
