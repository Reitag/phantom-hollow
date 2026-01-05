import { TooltipContentConfig } from '@/utils/types';
import {
  healthPotion,
  lightningPotion,
  protectPotion,
  spellPotion,
  undyingPotion,
} from '@/game/items/potions';
import { soulStone } from '@/game/items/stones';
import { DREAD_AURA_STATS, FIRE_BALL_STATS, FROST_BOLT_STATS } from './object-stats';
import { BLINK, FROST_BOLT, WIND } from './spell-cooldowns';
import {
  ARCANE_MIND,
  DISEASE,
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
        'Launches a frozen projectile that deals damage and attempts to freeze the target.\n' +
        'If the target resists the freeze, it instead applies *Arcane Mind*.\n\n' +
        '*Arcane Mind* is a buff that makes your next Fireball an instant cast.',
    },
  },
} as const;

// Items tooltips
const potionTitleParams = {
  color: '#a6a6a6ff',
} as const;

const stoneTitleParams = {
  color: '#6fcf97',
} as const;

const textParams = {
  color: '#f2c94c',
} as const;

export const ITEM_TOOLTIPS: {
  HEALTH_POTION: TooltipContentConfig;
  PROTECTION_POTION: TooltipContentConfig;
  SPELL_POTION: TooltipContentConfig;
  LIGHTNING_POTION: TooltipContentConfig;
  UNDYING_POTION: TooltipContentConfig;
  SOUL_STONE: TooltipContentConfig;
} = {
  HEALTH_POTION: {
    id: healthPotion().iconKey,
    title: {
      param: potionTitleParams,
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
      param: potionTitleParams,
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
      param: potionTitleParams,
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
      param: potionTitleParams,
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
      param: potionTitleParams,
      text: undyingPotion().name,
    },
    prop_1: {
      text: `Max: ${undyingPotion().maxStack} items at slot`,
    },
    prop_2: {
      param: textParams,
      text: undyingPotion().description,
    },
  },
  SOUL_STONE: {
    id: soulStone().iconKey,
    title: {
      param: stoneTitleParams,
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
  PROTECTION: TooltipContentConfig;
  SPELL_POWER: TooltipContentConfig;
  LIGHTNING_SHIELD: TooltipContentConfig;
  UNDYING: TooltipContentConfig;
  DISEASE: TooltipContentConfig;
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
      text: 'Increases damage of all spells and potion effects by 100%.',
    },
  },
  LIGHTNING_SHIELD: {
    id: LIGHTNING_SHIELD.id,
    title: {
      param: buffParams,
      text: 'Lightning Shield',
    },
    prop_1: {
      text: `Deals periodic damage to nearby enemies.`,
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

// Store tooltip
const storeTextParams = {
  fontStyle: 'bold',
  color: '#d7d7d7ff',
} as const;

const qParams = {
  color: '#f2c94c',
} as const;

export const STORE_TOOLTIP: TooltipContentConfig = {
  prop_1: {
    param: storeTextParams,
    text: 'Press ',
  },
  prop_2: {
    param: qParams,
    text: "'Q'",
  },
  prop_3: {
    param: storeTextParams,
    text: ' to Open Store',
  },
} as const;
