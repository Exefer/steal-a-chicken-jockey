import { CommandGuard } from "@rbxts/centurion";
import { ADMIN_IDS } from "shared/centurion/constants";

export const isAdmin: CommandGuard = ctx => {
  if (!ADMIN_IDS.has(ctx.executor.UserId)) {
    ctx.error("Insufficient permission!");
    return false;
  }
  return true;
};
