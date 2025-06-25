interface LeaderstatValues {
  Steals: number;
  Rebirths: number;
  Cash: number;
}

export class Leaderstats {
  /**
   * Gets a player's leaderstats folder.
   * @param player The player to get leaderstats for.
   * @returns The leaderstats folder.
   */
  private static getLeaderstatsFolder(player: Player): Folder {
    return player.WaitForChild("leaderstats") as Folder;
  }

  /**
   * Update leaderstat values using key-value pairs.
   * @param leaderstats The leaderstats folder.
   * @param values The key-value pairs to update.
   */
  private static updateLeaderstatValues(leaderstats: Folder, values: Partial<LeaderstatValues>): void {
    for (const [key, value] of pairs(values)) {
      const valueBase = leaderstats.FindFirstChild(key, true) as ValueBase;
      valueBase.Value = value;
    }
  }

  /**
   * Sets up the leaderstats folder for a player, initializing it with default or specified values.
   * @param player - The player for whom the leaderstats are being set up.
   * @param startValues - Optional initial values to set for the leaderstats.
   * The keys should match the names of the leaderstats instances and have proper types.
   */
  public static setup(player: Player, startValues?: Partial<LeaderstatValues>): void {
    const leaderstats = new Instance("Folder");
    leaderstats.Name = "leaderstats";
    leaderstats.Parent = player;

    const steals = new Instance("IntValue");
    steals.Name = "Steals";
    steals.Value = 0;
    steals.Parent = leaderstats;

    const rebirths = new Instance("IntValue");
    rebirths.Name = "Rebirths";
    rebirths.Value = 0;
    rebirths.Parent = leaderstats;

    const cash = new Instance("IntValue");
    cash.Name = "Cash";
    cash.Value = 0;
    cash.Parent = leaderstats;

    const isPrimary = new Instance("BoolValue");
    isPrimary.Name = "IsPrimary";
    isPrimary.Value = true;
    isPrimary.Parent = steals;

    if (!startValues) return;
    this.updateLeaderstatValues(leaderstats, startValues);
  }

  /**
   * Updates specific leaderstat values for a player.
   * @param player The player to update.
   * @param updates The values to update.
   */
  public static updateValues(player: Player, updates: Partial<LeaderstatValues>): void {
    const leaderstats = this.getLeaderstatsFolder(player);
    this.updateLeaderstatValues(leaderstats, updates);
  }

  /**
   * Gets all current leaderstat values for a player.
   * @param player The player to get values for.
   * @returns Object containing current values.
   */
  public static getValues(player: Player): LeaderstatValues {
    const leaderstats = this.getLeaderstatsFolder(player);
    const steals = leaderstats.WaitForChild("Steals") as IntValue;
    const rebirths = leaderstats.WaitForChild("Rebirths") as IntValue;
    const cash = leaderstats.WaitForChild("Cash") as IntValue;
    return {
      Steals: steals.Value,
      Rebirths: rebirths.Value,
      Cash: cash.Value,
    };
  }
}
