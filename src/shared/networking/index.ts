import { Networking } from "@flamework/networking";
import { SharedAlert } from "shared/types";

interface ClientToServerEvents {
  unlockBase(victim: Player): void;
}

interface ServerToClientEvents {
  alert(alert: SharedAlert, duration?: number): void;
  announce(announcement: string, duration?: number): void;
  clearAnnouncements(): void;
  characterAddedToPlot(generator: Plot["Generators"]["Empty"]): void;
  characterSpawned(character: Model): void;
  onDataLoaded(): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

// Returns an object containing a `server` and `client` field.
export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
