import { Controller, Modding, OnStart } from "@flamework/core";
import { OnCharacterAddedToPlot } from "client/listeners";
import { Events } from "client/networking";

@Controller()
export class OnCharacterAddedToPlotController implements OnStart {
  public onStart(): void {
    const listeners = new Set<OnCharacterAddedToPlot>();

    Modding.onListenerAdded<OnCharacterAddedToPlot>(object => listeners.add(object));
    Modding.onListenerRemoved<OnCharacterAddedToPlot>(object => listeners.delete(object));

    Events.characterAddedToPlot.connect(checkpointIndex => {
      for (const listener of listeners) {
        task.spawn(() => listener.onCharacterAddedToPlot(checkpointIndex));
      }
    });
  }
}
