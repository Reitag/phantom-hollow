import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UI } from '@/constants/asset-keys';
import { PROTECTION, SPELL_POWER, UNDYING } from '@/constants/modifier-stats';
import { InventoryItem } from '@/utils/types';

export const healthPotion = (): InventoryItem => ({
  id: 'health-potion',
  name: 'Health Potion',
  description: 'Restores 50 HP',
  iconKey: UI.HEALTH_POTION_ICON,
  maxStack: 5,
  use: () => {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    sandbox.healPlayer(50);

    return true;
  },
});

export const protectPotion = (): InventoryItem => ({
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

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Protection buff is already active');
      return false;
    }
  },
});

export const spellPotion = (): InventoryItem => ({
  id: 'spell-potion',
  name: 'Spell Potion',
  description: 'Increase spell power for 15 seconds',
  iconKey: UI.SPELL_POTION_ICON,
  maxStack: 5,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.player);
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(SPELL_POWER.id)) {
      modifier.addModifier(SPELL_POWER.id);
      modifier.startModifier(SPELL_POWER.id, player);

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Spell power buff is already active');
      return false;
    }
  },
});

export const undyingPotion = (): InventoryItem => ({
  id: 'undying-potion',
  name: 'Undying Potion',
  description: 'Makes you immune to death for 5 seconds',
  iconKey: UI.UNDYING_POTION_ICON,
  maxStack: 3,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.player);
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(UNDYING.id)) {
      modifier.addModifier(UNDYING.id);
      modifier.startModifier(UNDYING.id, player);

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Undying buff is already active');
      return false;
    }
  },
});

export const questItem = (): InventoryItem => ({
  id: 'quest_item',
  name: 'Boss Relic',
  description: 'Helps defeat the boss quickly',
  iconKey: 'quest_item_icon',
  maxStack: 1,
  use: () => {
    console.log('Used quest item');
    return true;
  },
});
