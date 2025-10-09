import { UI } from './asset-keys';

export const TYPE = {
  buff: 'buff',
  debuff: 'debuff',
} as const;

// Buffs
export const PROTECTION = {
  id: UI.PROTECTION_BUFF,
  duration: 10000,
  effect: 0.5,
  type: TYPE.buff,
};

export const UNDYING = {
  id: UI.UNDYING_BUFF,
  duration: 5000,
  hp_left: 1,
  type: TYPE.buff,
};

// Debuffs
export const DISEASE = {
  id: UI.DISEASE_DEBUFF,
  duration: 5000,
  damage: 5,
  type: TYPE.debuff,
};

export const SHADOW_VULNERABILITY = {
  id: UI.SHADOW_VULNERABILITY_DEBUFF,
  duration: 20000,
  effect: 1.1,
  type: TYPE.debuff,
};
