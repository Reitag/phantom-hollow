import { CHARACTERS, SPELLS } from './asset-keys';

export const GLOBAL = {
  NAME: 'global',
  DURATION: 1000,
} as const;

export const BLINK = {
  NAME: SPELLS.BLINK,
  DURATION: 6000,
} as const;

export const WIND = {
  NAME: SPELLS.WIND,
  DURATION: 3000,
} as const;

export const FROST_BOLT = {
  NAME: SPELLS.FROST_BOLT,
  DURATION: 2000,
} as const;

export const SUMMON_BAT = {
  NAME: CHARACTERS.MUTATED_BAT,
  DURATION: 2000,
} as const;

export const SHADOW_BOLT = {
  NAME: SPELLS.SHADOW_BOLT,
  DURATION: 6000,
} as const;
