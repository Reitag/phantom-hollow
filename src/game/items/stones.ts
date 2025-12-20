import { UI } from '@/constants/asset-keys';
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
