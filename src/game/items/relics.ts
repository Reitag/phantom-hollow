import { UI } from '@/constants/asset-keys';
import { InventoryItem } from '@/utils/types';

export const fireRelic = (): InventoryItem => ({
  id: 'fire-relic',
  name: 'Fire Relic',
  description:
    'Equip: Your Fireball grants a charge of Fire Energy.\n' +
    'At 3 charges, your next Fireball critically strikes.',

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
    'Equip: Your Frostbolt now freezes targets for 5 sec.\n' +
    'If the target cannot be frozen, Frostbite reduces its damage by an additional 20%.',
  iconKey: UI.FROST_RELIC_ICON,
  maxStack: 1,
  isUnique: true,
  use: () => {
    return false;
  },
});
