import { t } from "@rbxts/t";
import { ChangedCallbacks } from "server/types";

export type PlayerData = t.static<typeof Schema>;

const DataStructure: PlayerData = {
  Gameplay: {
    Cash: 500,
    Steals: 0,
    Rebirths: 0,
    LastPlayed: 0,
    Characters: [],
  },
  Products: {
    Gamepasses: new Set(),
    TotalRobuxSpent: 0,
  },
};

const GameplaySchema = t.strictInterface({
  /* TimeSpent: t.number, */
  Cash: t.number,
  Steals: t.number,
  Rebirths: t.number,
  LastPlayed: t.number,
  Characters: t.array(
    t.strictInterface({
      Name: t.string,
      EarnedCash: t.number,
      Mutation: t.string,
    })
  ),
});

const ProductsSchema = t.strictInterface({
  Gamepasses: t.set(t.string),
  TotalRobuxSpent: t.number,
});

const Schema = t.strictInterface({
  Gameplay: GameplaySchema,
  Products: ProductsSchema,
});

const ChangedCallbacks: ChangedCallbacks<PlayerData> = [
  (key, newData, oldData) => {
    /* print(key, " data changed", newData, oldData); */
  },
];

export const PlayerDataConfig = {
  DataStructure,
  Schema,
  ChangedCallbacks,
};
