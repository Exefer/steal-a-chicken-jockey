import Vide from "@rbxts/vide";
import { RARITY_COLORS } from "shared/constants/game";
import { CharacterRarity } from "shared/types";
import { abbreviator } from "shared/utils/abbreviator";
import { Text } from "../ui/text";

interface CharacterInfoProps {
  name: string;
  rarity: CharacterRarity;
  production: number;
  price: number;
}

const TEXT_SIZE = 18;
export function CharacterInfo(props: CharacterInfoProps) {
  const rarityColor = RARITY_COLORS[props.rarity];

  return (
    <Vide.Fragment>
      <Text
        text={props.name}
        anchorPoint={new Vector2(0.5, 0.5)}
        textSize={TEXT_SIZE}
        textColor={Color3.fromRGB(255, 255, 255)}
        size={new UDim2(1, 0, 0, TEXT_SIZE)}
      >
        <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={2} />
      </Text>
      <Text
        text={props.rarity}
        anchorPoint={new Vector2(0.5, 0.5)}
        textSize={TEXT_SIZE}
        textColor={rarityColor}
        size={new UDim2(1, 0, 0, TEXT_SIZE)}
      >
        <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={2} />
      </Text>
      <Text
        text={`$${abbreviator.numberToString(props.production)}/s`}
        anchorPoint={new Vector2(0.5, 0.5)}
        textSize={TEXT_SIZE}
        textColor={Color3.fromRGB(255, 255, 0)}
        size={new UDim2(1, 0, 0, TEXT_SIZE)}
      >
        <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={2} />
      </Text>
      <Text
        text={`$${abbreviator.numberToString(props.price)}`}
        anchorPoint={new Vector2(0.5, 0.5)}
        textSize={TEXT_SIZE}
        textColor={Color3.fromRGB(80, 255, 0)}
        size={new UDim2(1, 0, 0, TEXT_SIZE)}
      >
        <uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={2} />
      </Text>
      <uilistlayout
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
      />
    </Vide.Fragment>
  );
}
