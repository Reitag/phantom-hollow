import { healthPotion, protectPotion, spellPotion, undyingPotion } from '@/game/items/potions';
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
      const health = healthPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(health, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

        if (coinKeeper.removeCoins(1)) {
          inventory.addItem(health, 1);
        }
      }
    },
  },
  {
    ...protectPotion(),
    price: 2,
    onBuy: () => {
      const protect = protectPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(protect, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

        if (coinKeeper.removeCoins(2)) {
          inventory.addItem(protect, 1);
        }
      }
    },
  },
  {
    ...spellPotion(),
    price: 3,
    onBuy: () => {
      const spell = spellPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(spell, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

        if (coinKeeper.removeCoins(3)) {
          inventory.addItem(spell, 1);
        }
      }
    },
  },
  {
    ...undyingPotion(),
    price: 4,
    onBuy: () => {
      const undying = undyingPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(undying, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.player).getCoinKeeper();

        if (coinKeeper.removeCoins(4)) {
          inventory.addItem(undying, 1);
        }
      }
    },
  },
];
