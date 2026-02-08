import { UI } from '@/constants/asset-keys';
import { InventoryItem } from '@/utils/types';

export const firewormFang = (): InventoryItem => ({
  id: 'fireworm-fang',
  name: "Blazeworm's Fang",
  description: '',
  iconKey: UI.FIREWORM_FANG_QUEST_ITEM,
  maxStack: 1,
  isUnique: true,
  use: () => {
    return true;
  },
});
