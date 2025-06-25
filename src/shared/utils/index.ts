import { CollectionService, Workspace } from "@rbxts/services";
import { Tag } from "shared/constants/game";

export function getPlotForPlayer(player: Player): Plot {
  return Workspace.WaitForChild("Plots").WaitForChild(player.Name) as Plot;
}

export function getAllPlots(): Plot[] {
  return CollectionService.GetTagged(Tag.Plot) as Plot[];
}

export function getAllGenerators(): Plot["Generators"]["Empty"][] {
  return CollectionService.GetTagged(Tag.Generator) as Plot["Generators"]["Empty"][];
}
