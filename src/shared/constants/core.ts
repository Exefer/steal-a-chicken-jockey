import { RunService } from "@rbxts/services";

export const IS_SERVER = RunService.IsServer();
export const IS_CLIENT = RunService.IsClient();
export const IS_DEV = RunService.IsStudio();
export const IS_PROD = !IS_DEV;
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
