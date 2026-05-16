import {
  hastePotion,
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { arcaneShard, firewormFang } from '@/game/items/quests';
import { fireRelic, frostRelic } from '@/game/items/relics';
import { soulStone, stoneOfConcentration } from '@/game/items/stones';
import { InventoryItem } from '@/utils/types';

type LootFactory = () => InventoryItem;

export const LOOT_FACTORY: Record<string, LootFactory> = {
  'health-potion': healthPotion,
  'protect-potion': protectPotion,
  'spell-potion': spellPotion,
  'lightning-potion': lightningPotion,
  'undying-potion': undyingPotion,
  'fire-relic': fireRelic,
  'frost-relic': frostRelic,
  'soul-stone': soulStone,
  'stone-of-concentration': stoneOfConcentration,
  'arcane-shard': arcaneShard,
  'fireworm-fang': firewormFang,
  'haste-potion': hastePotion,
};
