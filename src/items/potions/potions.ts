import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { UI } from '@/constants/asset-keys';
import { PROTECTION, UNDYING } from '@/constants/modifier-stats';
import { InventoryItem } from '../core/item';

export const createHealthPotion = (): InventoryItem => ({
  id: 'health-potion',
  name: 'Health Potion',
  description: 'Restores 50 HP',
  iconKey: UI.HEALTH_POTION_ICON,
  maxStack: 5,
  use: () => {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    sandbox.healPlayer(50);
  },
});

export const createProtectPotion = (): InventoryItem => ({
  id: 'protect-potion',
  name: 'Protect Potion',
  description: 'Reduces damage taken for 10 seconds',
  iconKey: UI.PROTECTION_POTION_ICON,
  maxStack: 5,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.player);
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(PROTECTION.id)) {
      modifier.addModifier(PROTECTION.id);
      modifier.startModifier(PROTECTION.id, player);
    }
  },
});

export const createUndyingPotion = (): InventoryItem => ({
  id: 'undying-potion',
  name: 'Undying Potion',
  description: 'You cannot die for 5 seconds',
  iconKey: UI.UNDYING_POTION_ICON,
  maxStack: 3,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.player);
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(UNDYING.id)) {
      modifier.addModifier(UNDYING.id);
      modifier.startModifier(UNDYING.id, player);
    }
  },
});

export const createQuestItem = (): InventoryItem => ({
  id: 'quest_item',
  name: 'Boss Relic',
  description: 'Helps defeat the boss quickly',
  iconKey: 'quest_item_icon',
  maxStack: 1,
  use: () => {
    //const sandbox = ServiceLocator.resolve('sandbox');
    console.log('Used quest item');
    //sandbox.triggerEvent('boss_weakness');
  },
});
