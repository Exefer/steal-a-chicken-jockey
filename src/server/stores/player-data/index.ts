import { createPlayerStore } from "@rbxts/lyra";
import { IS_DEV } from "shared/constants/core";
import { PlayerDataConfig } from "./config";

export const PlayerDataStore = createPlayerStore({
  name: IS_DEV ? "Development" : "Production",
  template: PlayerDataConfig.DataStructure,
  schema: PlayerDataConfig.Schema,
  changedCallbacks: PlayerDataConfig.ChangedCallbacks,
});

export { PlayerData } from "./config";
