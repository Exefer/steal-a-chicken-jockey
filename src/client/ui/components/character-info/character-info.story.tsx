import Vide from "@rbxts/vide";
import { quickStory } from "client/ui/utils/quick-story";
import { CharacterRarity } from "shared/types";
import { CharacterInfo } from "./character-info";

const controls = {
  name: "Stupid Jockey",
  rarity: "Mythic" as CharacterRarity,
  production: 5,
  price: 100,
};

export = quickStory({}, props => {
  return (
    <Vide.Fragment>
      <CharacterInfo
        name={controls.name}
        rarity={controls.rarity}
        production={controls.production}
        price={controls.price}
      />
    </Vide.Fragment>
  );
});
