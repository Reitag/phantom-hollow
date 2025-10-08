import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { UI } from '@/constants/asset-keys';
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
    //const player = ServiceLocator.resolve('player');
    console.log('Used protection potion');
    //player.activateShield(10);
  },
});

export const createUndyingPotion = (): InventoryItem => ({
  id: 'undying-potion',
  name: 'Undying Potion',
  description: 'You cannot die for 5 seconds',
  iconKey: UI.UNDYING_POTION_ICON,
  maxStack: 3, // maybe more rare
  use: () => {
    //const player = ServiceLocator.resolve('player');
    console.log('Used undying potion');
    //player.activateUndying(5);
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
