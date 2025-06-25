export const enum Tag {
  Plot = "Plot",
  Character = "Character",
  Generator = "Generator",
}

export const enum CollisionGroup {
  ChickenJockeys = "ChickenJockeys",
  PlayerCharacters = "PlayerCharacters",
}

export const enum CharacterMutation {
  None = "None",
}

export const RARITY_COLORS = {
  Common: Color3.fromRGB(0, 255, 0),
  Rare: Color3.fromRGB(90, 90, 180),
  Epic: Color3.fromRGB(150, 0, 250),
  Legendary: Color3.fromRGB(255, 255, 0),
  Mythic: Color3.fromRGB(255, 0, 0),
} as const;
