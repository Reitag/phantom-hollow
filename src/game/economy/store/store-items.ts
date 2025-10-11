import { healthPotion, protectPotion, undyingPotion } from '@/game/items/potions';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconKey: string;
  onBuy: () => void;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    ...healthPotion(),
    price: 1,
    onBuy: () => {
      const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

      if (coinKeeper.removeCoins(1)) {
        const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
        const health = healthPotion();
        inventory.addItem(health, 1);
      }
    },
  },
  {
    ...protectPotion(),
    price: 2,
    onBuy: () => {
      const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

      if (coinKeeper.removeCoins(2)) {
        const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
        const protect = protectPotion();
        inventory.addItem(protect, 1);
      }
    },
  },
  {
    ...undyingPotion(),
    price: 3,
    onBuy: () => {
      const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

      if (coinKeeper.removeCoins(3)) {
        const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
        const undie = undyingPotion();
        inventory.addItem(undie, 1);
      }
    },
  },
];
