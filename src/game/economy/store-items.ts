import {
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { soulStone } from '@/game/items/stones';
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
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        //if (coinKeeper.removeCoins(1)) {
        if (coinKeeper.removeCoins(0)) {
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
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        //if (coinKeeper.removeCoins(2)) {
        if (coinKeeper.removeCoins(0)) {
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
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        //if (coinKeeper.removeCoins(3)) {
        if (coinKeeper.removeCoins(0)) {
          inventory.addItem(spell, 1);
        }
      }
    },
  },
  {
    ...lightningPotion(),
    price: 4,
    onBuy: () => {
      const lightning = lightningPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(lightning, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        //if (coinKeeper.removeCoins(4)) {
        if (coinKeeper.removeCoins(0)) {
          inventory.addItem(lightning, 1);
        }
      }
    },
  },
  {
    ...undyingPotion(),
    price: 5,
    onBuy: () => {
      const undying = undyingPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(undying, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        //if (coinKeeper.removeCoins(4)) {
        if (coinKeeper.removeCoins(0)) {
          inventory.addItem(undying, 1);
        }
      }
    },
  },
  {
    ...soulStone(),
    price: 0,
    onBuy: () => {
      const stone = soulStone();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
      const ui = ServiceLocator.resolve(ServiceKeys.ui);

      if (stone.isUnique) {
        const alreadyOwned = inventory.getItems().some((slot) => slot && slot.item.id === stone.id);

        if (alreadyOwned) {
          ui.addWarningtext('There is only one unique item in inventory');
          return;
        }
      }

      if (!inventory.canAdd(stone, 1)) {
        ui.addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(0)) {
          inventory.addItem(stone, 1);
        }
      }
    },
  },
];
