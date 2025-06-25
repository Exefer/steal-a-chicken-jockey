import { Centurion } from "@rbxts/centurion";
import { CenturionUI } from "@rbxts/centurion-ui";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ADMIN_IDS } from "shared/centurion/constants";

if (ADMIN_IDS.has(Players.LocalPlayer.UserId)) {
  const client = Centurion.client();

  client.registry.load(ReplicatedStorage.TS.centurion.types);

  client
    .start()
    .then(() => CenturionUI.start(client))
    .catch(err => warn("Failed to start Centurion:", err));
}
