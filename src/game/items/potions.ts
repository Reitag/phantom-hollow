import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { VFX, UI } from '@/constants/asset-keys';
import {
  HASTE,
  LIGHTNING_SHIELD,
  PROTECTION,
  SPELL_POWER,
  UNDYING,
} from '@/constants/modifier-stats';
import { InventoryItem } from '@/utils/types';
import { AttachedVfx } from '@/entities/misc/attached-vfx';
import { VFX_ANIMATION } from '@/constants/animation-keys';

export const healthPotion = (): InventoryItem => ({
  id: 'health-potion',
  name: 'Health Potion',
  description: 'Use: Restores 50 health.',
  iconKey: UI.HEALTH_POTION_ICON,
  maxStack: 5,
  isUnique: false,
  use: () => {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    sandbox.healPlayer(50);

    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    new AttachedVfx({
      scene: player.scene,
      caster: player,
      keyName: VFX.HEAL_VFX,
      animKey: VFX_ANIMATION.HEAL.MAIN,
    });

    return true;
  },
});

export const protectPotion = (): InventoryItem => ({
  id: 'protect-potion',
  name: 'Protect Potion',
  description: 'Use: Reduces damage taken from physical and spell attacks by 50% for 10 sec.',
  iconKey: UI.PROTECTION_POTION_ICON,
  maxStack: 5,
  isUnique: false,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(PROTECTION.id)) {
      modifier.addModifier(PROTECTION.id);
      modifier.startModifier(PROTECTION.id, player);

      new AttachedVfx({
        scene: player.scene,
        caster: player,
        keyName: VFX.PROTECTION_VFX,
        animKey: VFX_ANIMATION.PROTECTION.MAIN,
      });

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
  description: 'Use: Increases spell power by 100% for 20 sec.',
  iconKey: UI.SPELL_POTION_ICON,
  maxStack: 5,
  isUnique: false,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(SPELL_POWER.id)) {
      modifier.addModifier(SPELL_POWER.id);
      modifier.startModifier(SPELL_POWER.id, player);

      new AttachedVfx({
        scene: player.scene,
        caster: player,
        keyName: VFX.SPELL_VFX,
        animKey: VFX_ANIMATION.SPELL.MAIN,
        offsetY: -40,
      });

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Spell power buff is already active');
      return false;
    }
  },
});

export const lightningPotion = (): InventoryItem => ({
  id: 'lightning-potion',
  name: 'Lightning Potion',
  description:
    'Use: Surrounds you with a Lightning Shield for 15 sec.\n\n' +
    'Lightning Shield deals periodic damage to nearby enemies.',
  iconKey: UI.LIGHTNING_POTION_ICON,
  maxStack: 5,
  isUnique: false,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(LIGHTNING_SHIELD.id)) {
      modifier.addModifier(LIGHTNING_SHIELD.id);
      modifier.startModifier(LIGHTNING_SHIELD.id, player);

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Lightning Shield spell is already active');
      return false;
    }
  },
});

export const undyingPotion = (): InventoryItem => ({
  id: 'undying-potion',
  name: 'Undying Potion',
  description: 'Use: Prevents death for 10 sec, leaving you at 1 Health instead.',
  iconKey: UI.UNDYING_POTION_ICON,
  maxStack: 3,
  isUnique: false,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(UNDYING.id)) {
      modifier.addModifier(UNDYING.id);
      modifier.startModifier(UNDYING.id, player);

      new AttachedVfx({
        scene: player.scene,
        caster: player,
        keyName: VFX.UNDYING_VFX,
        animKey: VFX_ANIMATION.UNDYING.MAIN,
      });

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Undying buff is already active');
      return false;
    }
  },
});

export const hastePotion = (): InventoryItem => ({
  id: 'haste-potion',
  name: 'Haste Potion',
  description: 'Use: Permanetely increases your movement speed at 15%.',
  iconKey: UI.HASTE_POTION_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(HASTE.id)) {
      modifier.addModifier(HASTE.id);
      modifier.startModifier(HASTE.id, player);

      new AttachedVfx({
        scene: player.scene,
        caster: player,
        keyName: VFX.HASTE_VFX,
        animKey: VFX_ANIMATION.HASTE.MAIN,
      });

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Haste buff is already active');
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
  isUnique: true,
  use: () => {
    console.log('Used quest item');
    return true;
  },
});
