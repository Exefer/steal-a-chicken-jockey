import { RARITY_COLORS } from "shared/constants/game";

export type CharacterRarity = keyof typeof RARITY_COLORS;

export interface SharedAlert {
  text: string;
  type: "error" | "info";
}
