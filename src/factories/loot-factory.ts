import {
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { soulStone } from '@/game/items/stones';
import { InventoryItem } from '@/utils/types';

type LootFactory = () => InventoryItem;

export const LOOT_FACTORY: Record<string, LootFactory> = {
  'health-potion': healthPotion,
  'protect-potion': protectPotion,
  'spell-potion': spellPotion,
  'lightning-potion': lightningPotion,
  'undying-potion': undyingPotion,
  'soul-stone': soulStone,
};
