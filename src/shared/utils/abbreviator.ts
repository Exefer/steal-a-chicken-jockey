import Abbreviator from "@rbxts/abbreviate";
import Sift from "@rbxts/sift";

const baseAbbreviator = new Abbreviator();

baseAbbreviator.setSetting("suffixTable", ["K", "M", "B", "T", "Qa"]);
baseAbbreviator.setSetting("decimalPlaces", 1);

const abbreviator = Sift.Dictionary.merge(Sift.Dictionary.removeKeys(baseAbbreviator, "numberToString"), {
  numberToString(number: number, roundDown?: boolean): string {
    return number < 1000 ? tostring(number) : baseAbbreviator.numberToString(number, roundDown);
  },
});

export { abbreviator };
