export interface OnCharacterAddedToPlot {
  onCharacterAddedToPlot(generator: Plot["Generators"]["Empty"]): void;
}

export interface OnCharacterSpawned {
  onCharacterSpawned(character: Model): void;
}
