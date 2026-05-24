import { UI } from '@/constants/asset-keys';
import { InventoryItem } from '@/utils/types';

export const fireRelic = (): InventoryItem => ({
  id: 'fire-relic',
  name: 'Fire Relic',
  description:
    'Passive: Fireball grants a charge of Combustion.' +
    'At 3 charges, Fireball becomes an instant cast and deals a Critical Strike.\n' +
    'Only one relic can be carried.',
  iconKey: UI.FIRE_RELIC_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    return false;
  },
});

export const frostRelic = (): InventoryItem => ({
  id: 'frost-relic',
  name: 'Frost Relic',
  description:
    'Passive: Frostbolt now freezes targets for 5 sec.' +
    'Maximum Health is increased by 50%.\n' +
    'Only one relic can be carried.',
  iconKey: UI.FROST_RELIC_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    return false;
  },
});
