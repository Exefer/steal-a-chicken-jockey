import { Centurion } from "@rbxts/centurion";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { ADMIN_IDS } from "shared/centurion/constants";

const server = Centurion.server({
  syncFilter: player => {
    return ADMIN_IDS.has(player.UserId);
  },
});

server.registry.load(ReplicatedStorage.TS.centurion.types);
server.registry.load(ServerScriptService.TS.centurion.commands);
server.registry.registerGroup(
  {
    name: "server",
    description: "Commands that affect the server",
  },
  {
    name: "global",
    description: "Game-wide commands that affect all players",
  }
);

server.start();
