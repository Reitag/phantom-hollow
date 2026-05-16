import { ITEM_COSTS } from '@/constants/item-costs';
import {
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { fireRelic, frostRelic } from '../items/relics';

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
    price: ITEM_COSTS.HEALTH_POTION,
    onBuy: () => {
      const health = healthPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(health, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.HEALTH_POTION)) {
          inventory.addItem(health, 1);
        }
      }
    },
  },
  {
    ...protectPotion(),
    price: ITEM_COSTS.PROTECTION_POTION,
    onBuy: () => {
      const protect = protectPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(protect, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.PROTECTION_POTION)) {
          inventory.addItem(protect, 1);
        }
      }
    },
  },
  {
    ...spellPotion(),
    price: ITEM_COSTS.SPELL_POTION,
    onBuy: () => {
      const spell = spellPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(spell, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.SPELL_POTION)) {
          inventory.addItem(spell, 1);
        }
      }
    },
  },
  {
    ...lightningPotion(),
    price: ITEM_COSTS.LIGHTNING_POTION,
    onBuy: () => {
      const lightning = lightningPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(lightning, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.LIGHTNING_POTION)) {
          inventory.addItem(lightning, 1);
        }
      }
    },
  },
  /*{
    ...undyingPotion(),
    price: ITEM_COSTS.UNDYING_POTION,
    onBuy: () => {
      const undying = undyingPotion();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      if (!inventory.canAdd(undying, 1)) {
        ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.UNDYING_POTION)) {
          inventory.addItem(undying, 1);
        }
      }
    },
  },*/
  /*{
    ...soulStone(),
    price: 10,
    onBuy: () => {
      const stone = soulStone();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
      const ui = ServiceLocator.resolve(ServiceKeys.ui);

      if (stone.isUnique) {
        const alreadyOwned = inventory.getSlots().some((slot) => slot && slot.item.id === stone.id);

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

        if (coinKeeper.removeCoins(10)) {
          inventory.addItem(stone, 1);
        }
      }
    },
  },*/
  {
    ...fireRelic(),
    price: ITEM_COSTS.FIRE_RELIC,
    onBuy: () => {
      const relic = fireRelic();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);

      if (relic.isUnique) {
        const alreadyOwned = inventory.getSlots().some((slot) => slot && slot.item.id === relic.id);

        if (alreadyOwned) {
          ui.addWarningtext('There is only one unique item in inventory');
          return;
        }
      }

      if (sandbox.findSomeRelic()) {
        ui.addWarningtext('Only one relic can be equiped in the bag');
        return;
      }

      if (!inventory.canAdd(relic, 1)) {
        ui.addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.FIRE_RELIC)) {
          inventory.addItem(relic, 1);
        }
      }
    },
  },
  {
    ...frostRelic(),
    price: ITEM_COSTS.FROST_RELIC,
    onBuy: () => {
      const relic = frostRelic();
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);

      if (relic.isUnique) {
        const alreadyOwned = inventory.getSlots().some((slot) => slot && slot.item.id === relic.id);

        if (alreadyOwned) {
          ui.addWarningtext('There is only one unique item in inventory');
          return;
        }
      }

      if (sandbox.findSomeRelic()) {
        ui.addWarningtext('Only one relic can be equiped in the bag');
        return;
      }

      if (!inventory.canAdd(relic, 1)) {
        ui.addWarningtext('The inventory is full');
      } else {
        const coinKeeper = ServiceLocator.resolve(ServiceKeys.playerHandler)
          .getPlayer()
          .getCoinKeeper();

        if (coinKeeper.removeCoins(ITEM_COSTS.FROST_RELIC)) {
          inventory.addItem(relic, 1);
        }
      }
    },
  },
];
