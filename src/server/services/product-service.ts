import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { Events } from "server/networking";
import { DevProduct, DevProductPlayerAttribute } from "shared/assets";
import { getPlotForPlayer } from "shared/utils";

type ProductHandler = (player: Player) => void;

@Service()
export class ProductService implements OnStart {
  private static readonly PRODUCT_HANDLERS = new Map<number, ProductHandler>();

  static {
    this.createProductHandler(DevProduct.UnlockBase, player => {
      const victim = Players.GetPlayerByUserId(player.GetAttribute(DevProductPlayerAttribute.UnlockBase) as number);
      if (!victim) return;
      const plot = getPlotForPlayer(victim);
      plot.SetAttribute("Locked", false);

      Events.alert.fire(victim, {
        text: `Your base has been <font color='#ffff00'>unlocked</font> by ${player.Name}!`,
        type: "info",
      });
    });
  }

  public onStart(): void {
    MarketplaceService.ProcessReceipt = receipt => {
      const player = Players.GetPlayerByUserId(receipt.PlayerId);
      const handler = ProductService.PRODUCT_HANDLERS.get(receipt.ProductId);

      if (!player || !handler) {
        return Enum.ProductPurchaseDecision.NotProcessedYet;
      }

      const [success, message] = pcall(handler, player);

      if (!success) {
        warn(message);
        return Enum.ProductPurchaseDecision.NotProcessedYet;
      }

      return Enum.ProductPurchaseDecision.PurchaseGranted;
    };
  }

  private static createProductHandler(productId: number, handler: ProductHandler): void {
    ProductService.PRODUCT_HANDLERS.set(productId, handler);
  }
}
