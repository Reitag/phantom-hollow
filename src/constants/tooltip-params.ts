import { TooltipContentConfig } from '@/utils/types';
import {
  hastePotion,
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { fireRelic, frostRelic } from '@/game/items/relics';
import { soulStone, stoneOfConcentration } from '@/game/items/stones';
import { arcaneShard, firewormFang } from '@/game/items/quests';
import {
  CRYSTAL_SHRINE_STATS,
  DREAD_AURA_STATS,
  FIRE_BALL_STATS,
  FROST_BOLT_STATS,
} from './object-stats';
import { BLINK, FROST_BOLT, WIND } from './spell-cooldowns';
import {
  ARCANE_MIND,
  CONCENTRATION,
  DISEASE,
  FROST_SKIN,
  FROSTBITE,
  HASTE,
  LIGHTNING_SHIELD,
  PROTECTION,
  SHADOW_VULNERABILITY,
  SPELL_POWER,
  UNDYING,
} from './modifier-stats';

// Base Style
export const baseStyle = {
  fontSize: '12px',
  fontFamily: 'Arial',
  color: '#ffffff',
} as const;

// Spell tooltips
const spelltitleParams = {
  fontSize: '14px',
  fontStyle: 'bold',
  color: '#ffdd55',
} as const;

const spellCastParams = {
  color: '#9ecaff',
} as const;

const spellCooldownParams = {
  color: '#ff5c5cff',
} as const;

export const SPELL_TOOLTIPS: {
  FIREBALL: TooltipContentConfig;
  BLINK: TooltipContentConfig;
  WIND: TooltipContentConfig;
  FROSTBOLT: TooltipContentConfig;
} = {
  FIREBALL: {
    title: {
      param: spelltitleParams,
      text: 'Fireball',
    },
    prop_1: {
      param: spellCastParams,
      text: `${FIRE_BALL_STATS.CAST_TIME / 1000} sec cast`,
    },
    prop_2: {
      text: 'Launches a fiery projectile that deals damage.',
    },
  },
  BLINK: {
    title: {
      param: spelltitleParams,
      text: 'Blink',
    },
    prop_1: {
      param: spellCastParams,
      text: 'Instant cast',
    },
    prop_2: {
      param: spellCooldownParams,
      text: `${BLINK.DURATION / 1000} sec cooldown`,
    },
    prop_3: {
      text: 'Teleports the caster a short distance forward.',
    },
  },
  WIND: {
    title: {
      param: spelltitleParams,
      text: 'Wind Pulse',
    },
    prop_1: {
      param: spellCastParams,
      text: 'Instant cast',
    },
    prop_2: {
      param: spellCooldownParams,
      text: `${WIND.DURATION / 1000} sec cooldown`,
    },
    prop_3: {
      text: 'Releases a sudden burst of wind in both directions, knocking back nearby enemies.',
    },
  },
  FROSTBOLT: {
    title: {
      param: spelltitleParams,
      text: 'Frostbolt',
    },
    prop_1: {
      param: spellCastParams,
      text: `${FROST_BOLT_STATS.CAST_TIME / 1000} sec cast`,
    },
    prop_2: {
      param: spellCooldownParams,
      text: `${FROST_BOLT.DURATION / 1000} sec cooldown`,
    },
    prop_3: {
      text:
        'Launches a frozen projectile that deals damage and applies Frostbite for 5 sec.\n\n' +
        'Frostbite slows the target by 60%.\n' +
        'If the target cannot be slowed or frozen, it takes 50% increased damage instead.',
    },
  },
} as const;

// Items tooltips
const commonTitleParams = {
  color: '#ffffff',
} as const;

const uncommonTitleParams = {
  //color: '#6fcf97',
  color: '#1be401',
} as const;

const rareTitleParams = {
  //color: '#6795c4',
  color: '#0070dd',
} as const;

const questTitleParams = {
  color: '#ffd100',
} as const;

const textParams = {
  color: '#f2c94c',
} as const;

const additionTextParams = {
  color: '#9d9d9d',
} as const;

export const ITEM_TOOLTIPS: {
  HEALTH_POTION: TooltipContentConfig;
  PROTECTION_POTION: TooltipContentConfig;
  SPELL_POTION: TooltipContentConfig;
  LIGHTNING_POTION: TooltipContentConfig;
  UNDYING_POTION: TooltipContentConfig;
  HASTE_POTION: TooltipContentConfig;
  FIRE_RELIC: TooltipContentConfig;
  FROST_RELIC: TooltipContentConfig;
  SOUL_STONE: TooltipContentConfig;
  STONE_OF_CONCENTRATION: TooltipContentConfig;
  FIREWORM_FANG: TooltipContentConfig;
  ARCANE_SHARD: TooltipContentConfig;
} = {
  HEALTH_POTION: {
    id: healthPotion().iconKey,
    title: {
      param: commonTitleParams,
      text: healthPotion().name,
    },
    prop_1: {
      text: `Max: ${healthPotion().maxStack} items at slot`,
    },
    prop_2: {
      param: textParams,
      text: healthPotion().description,
    },
  },
  PROTECTION_POTION: {
    id: protectPotion().iconKey,
    title: {
      param: commonTitleParams,
      text: protectPotion().name,
    },
    prop_1: {
      text: `Max: ${protectPotion().maxStack} items at slot`,
    },
    prop_2: {
      param: textParams,
      text: protectPotion().description,
    },
  },
  SPELL_POTION: {
    id: spellPotion().iconKey,
    title: {
      param: commonTitleParams,
      text: spellPotion().name,
    },
    prop_1: {
      text: `Max: ${spellPotion().maxStack} items at slot`,
    },
    prop_2: {
      param: textParams,
      text: spellPotion().description,
    },
  },
  LIGHTNING_POTION: {
    id: lightningPotion().iconKey,
    title: {
      param: commonTitleParams,
      text: lightningPotion().name,
    },
    prop_1: {
      text: `Max: ${lightningPotion().maxStack} items at slot`,
    },
    prop_2: {
      param: textParams,
      text: lightningPotion().description,
    },
  },
  UNDYING_POTION: {
    id: undyingPotion().iconKey,
    title: {
      param: uncommonTitleParams,
      text: undyingPotion().name,
    },
    prop_1: {
      text: `Unique item`,
    },
    prop_2: {
      param: textParams,
      text: undyingPotion().description,
    },
  },
  HASTE_POTION: {
    id: hastePotion().iconKey,
    title: {
      param: rareTitleParams,
      text: hastePotion().name,
    },
    prop_1: {
      text: `Unique item`,
    },
    prop_2: {
      param: textParams,
      text: hastePotion().description,
    },
    prop_3: {
      param: additionTextParams,
      text: '"Octius brewed this before your eyes. He calls it his masterpiece."',
    },
  },
  FIRE_RELIC: {
    id: fireRelic().iconKey,
    title: {
      param: rareTitleParams,
      text: fireRelic().name,
    },
    prop_1: {
      text: `Unique item`,
    },
    prop_2: {
      param: textParams,
      text: fireRelic().description,
    },
  },
  FROST_RELIC: {
    id: frostRelic().iconKey,
    title: {
      param: rareTitleParams,
      text: frostRelic().name,
    },
    prop_1: {
      text: `Unique item`,
    },
    prop_2: {
      param: textParams,
      text: frostRelic().description,
    },
  },
  SOUL_STONE: {
    id: soulStone().iconKey,
    title: {
      param: uncommonTitleParams,
      text: soulStone().name,
    },
    prop_1: {
      text: 'Unique item',
    },
    prop_2: {
      param: textParams,
      text: soulStone().description,
    },
  },
  STONE_OF_CONCENTRATION: {
    id: stoneOfConcentration().iconKey,
    title: {
      param: rareTitleParams,
      text: stoneOfConcentration().name,
    },
    prop_1: {
      text: 'Unique item',
    },
    prop_2: {
      param: textParams,
      text: stoneOfConcentration().description,
    },
    prop_3: {
      param: additionTextParams,
      text: '"The longer you stare into it, the quieter the world becomes."',
    },
  },
  FIREWORM_FANG: {
    id: firewormFang().iconKey,
    title: {
      param: questTitleParams,
      text: firewormFang().name,
    },
    prop_1: {
      text: 'Quest item',
    },
    prop_3: {
      param: additionTextParams,
      text: '"Still warm to the touch. It reeks of sulfur and ash."',
    },
  },
  ARCANE_SHARD: {
    id: arcaneShard().iconKey,
    title: {
      param: questTitleParams,
      text: arcaneShard().name,
    },
    prop_1: {
      text: 'Quest item',
    },
    prop_3: {
      param: additionTextParams,
      text: 'A piece of something whole, still echoing its origin.',
    },
  },
};

// Modifier tooltips
const buffParams = {
  fontSize: '14px',
  fontStyle: 'bold',
  color: '#6fcf97',
} as const;

const debuffParams = {
  fontSize: '14px',
  fontStyle: 'bold',
  color: '#eb5757',
} as const;

export const MODIFIER_TOOLTIPS: {
  ARCANE_MIND: TooltipContentConfig;
  CONCENTRATION: TooltipContentConfig;
  PROTECTION: TooltipContentConfig;
  SPELL_POWER: TooltipContentConfig;
  LIGHTNING_SHIELD: TooltipContentConfig;
  UNDYING: TooltipContentConfig;
  FROST_SKIN: TooltipContentConfig;
  HASTE: TooltipContentConfig;
  DISEASE: TooltipContentConfig;
  CRYSTAL_RENEWAL: TooltipContentConfig;
  FROSTBITE: TooltipContentConfig;
  SHADOW_VULNERABILITY: TooltipContentConfig;
  DREAD_AURA: TooltipContentConfig;
} = {
  ARCANE_MIND: {
    id: ARCANE_MIND.id,
    title: {
      param: buffParams,
      text: 'Arcane Mind',
    },
    prop_1: {
      text: 'Fireball becomes an instant cast spell.',
    },
  },
  CONCENTRATION: {
    id: CONCENTRATION.id,
    title: {
      param: buffParams,
      text: 'Concentration',
    },
    prop_1: {
      text: 'Casting speed increased by 20%.',
    },
  },
  PROTECTION: {
    id: PROTECTION.id,
    title: {
      param: buffParams,
      text: 'Protection',
    },
    prop_1: {
      text: 'Reduces all incoming damage by 50%',
    },
  },
  SPELL_POWER: {
    id: SPELL_POWER.id,
    title: {
      param: buffParams,
      text: 'Spell Power',
    },
    prop_1: {
      text: 'Increases damage of all spells and potion effects by 50%.',
    },
  },
  LIGHTNING_SHIELD: {
    id: LIGHTNING_SHIELD.id,
    title: {
      param: buffParams,
      text: 'Lightning Shield',
    },
    prop_1: {
      text: 'Absorbs incoming damage and deals periodic damage to nearby enemies.',
    },
  },
  UNDYING: {
    id: UNDYING.id,
    title: {
      param: buffParams,
      text: 'Undying',
    },
    prop_1: {
      text: 'Unable to die.',
    },
  },
  FROST_SKIN: {
    id: FROST_SKIN.id,
    title: {
      param: buffParams,
      text: 'Frost Skin',
    },
    prop_1: {
      text: 'Maximum health increased by 50%.',
    },
  },
  HASTE: {
    id: HASTE.id,
    title: {
      param: buffParams,
      text: 'Haste',
    },
    prop_1: {
      text: 'Speed increased by 15%.',
    },
  },
  CRYSTAL_RENEWAL: {
    id: CRYSTAL_SHRINE_STATS.KEY_NAME,
    title: {
      param: buffParams,
      text: 'Crystal Renewal',
    },
    prop_1: {
      text: 'Regenerates health while inside the shrine.',
    },
  },
  DISEASE: {
    id: DISEASE.id,
    title: {
      param: debuffParams,
      text: 'Disease',
    },
    prop_1: {
      text: 'Periodically deals damage over time.',
    },
  },
  FROSTBITE: {
    id: FROSTBITE.id,
    title: {
      param: debuffParams,
      text: 'Frostbite',
    },
    prop_1: {
      text: 'Speed reduced by 60%.',
    },
  },

  SHADOW_VULNERABILITY: {
    id: SHADOW_VULNERABILITY.id,
    title: {
      param: debuffParams,
      text: 'Shadow Vulnerabilty',
    },
    prop_1: {
      text: 'Increases all incoming damage by 20%.',
    },
  },
  DREAD_AURA: {
    id: DREAD_AURA_STATS.KEY_NAME,
    title: {
      param: debuffParams,
      text: 'Dread Aura',
    },
    prop_1: {
      text: 'Continuously deals damage.',
    },
  },
};

// Interactables
const interactTextParams = {
  fontStyle: 'bold',
  color: '#d7d7d7ff',
} as const;

const qParams = {
  color: '#f2c94c',
} as const;

// Store tooltip
export const STORE_TOOLTIP: TooltipContentConfig = {
  prop_1: {
    param: interactTextParams,
    text: 'Press ',
  },
  prop_2: {
    param: qParams,
    text: "'Q'",
  },
  prop_3: {
    param: interactTextParams,
    text: ' to Open Store',
  },
} as const;

// Quests
export const QUEST_TOOLTIP: TooltipContentConfig = {
  prop_1: {
    param: interactTextParams,
    text: 'Press ',
  },
  prop_2: {
    param: qParams,
    text: "'Q'",
  },
  prop_3: {
    param: interactTextParams,
    text: ' to Interact',
  },
} as const;

// Loot Zones
export const LOOT_ZONE_TOOLTIP: TooltipContentConfig = {
  prop_1: {
    param: interactTextParams,
    text: 'Press ',
  },
  prop_2: {
    param: qParams,
    text: "'Q'",
  },
  prop_3: {
    param: interactTextParams,
    text: ' to Loot the Items',
  },
} as const;

// Greeting Letter
export const GREETING_LETTER_TOOLTIP: TooltipContentConfig = {
  prop_1: {
    param: interactTextParams,
    text: 'Press ',
  },
  prop_2: {
    param: qParams,
    text: "'Q'",
  },
  prop_3: {
    param: interactTextParams,
    text: ' to Open the Letter',
  },
} as const;
