import { SPELLS } from './asset-keys';

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
