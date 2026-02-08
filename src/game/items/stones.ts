import { VFX_ANIMATION } from '@/constants/animation-keys';
import { UI, VFX } from '@/constants/asset-keys';
import { CONCENTRATION } from '@/constants/modifier-stats';
import { AttachedVfx } from '@/entities/misc/attached-vfx';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { InventoryItem } from '@/utils/types';

export const soulStone = (): InventoryItem => ({
  id: 'soul-stone',
  name: 'Soul Stone',
  description: 'Use: Binds your soul to a Soul Pedestal, allowing resurrection at that location.',
  iconKey: UI.SOUL_STONE_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    const scene = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer().scene;
    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    const activeRegistery = scene.registry.get('active-soul-pedestal');

    if (!activeRegistery) {
      ui.addWarningtext('Required a Soul Pedestal to use this item');
    } else {
      scene.events.emit('trigger-soul-stone');
    }
    // Used return false in order do not accidentally waste item on bounded Pedestal
    return false;
  },
});

export const stoneOfConcentration = (): InventoryItem => ({
  id: 'stone-of-concentration',
  name: 'Stone of Concentration',
  description:
    'Use: Infuses your staff with pure arcane concentration, permanently reducing the cast time of your spells by 20%',
  iconKey: UI.STONE_OF_CONCENTRATION_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    const modifier = player.getModifier();

    if (!modifier.isModifierExist(CONCENTRATION.id)) {
      modifier.addModifier(CONCENTRATION.id);
      modifier.startModifier(CONCENTRATION.id, player);

      new AttachedVfx({
        scene: player.scene,
        caster: player,
        keyName: VFX.CONCENTRATION_VFX,
        animKey: VFX_ANIMATION.CONCENTRATION.MAIN,
      });

      return true;
    } else {
      const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
      sandbox.setText('Concentration buff is already active');
      return false;
    }
  },
});
