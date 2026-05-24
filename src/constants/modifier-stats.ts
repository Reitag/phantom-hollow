import { UI } from './asset-keys';
import { PLAYER_STATS } from './object-stats';

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

export const SPELL_POWER = {
  id: UI.SPELL_POWER_BUFF,
  duration: 15000,
  effect: 1.5,
  type: TYPE.buff,
};

export const LIGHTNING_SHIELD = {
  id: UI.LIGHTNING_SHIELD_BUFF,
  duration: 15000,
  damage_absorb: 200,
  type: TYPE.buff,
};

export const UNDYING = {
  id: UI.UNDYING_BUFF,
  duration: 5000,
  hp_left: 1,
  type: TYPE.buff,
};

export const ARCANE_MIND = {
  id: UI.ARCANE_MIND_BUFF,
  duration: 5000,
  type: TYPE.buff,
};

export const FROST_SKIN = {
  id: UI.FROST_SKIN_BUFF,
  health: PLAYER_STATS.HEALTH * 1.5,
  type: TYPE.buff,
};

// Not presented in Modifiers, used in Sandbox instead
export const FIRE_ENERGY = {
  id: UI.FIRE_ENERGY_BUFF,
  type: TYPE.buff,
};

export const HASTE = {
  id: UI.HASTE_BUFF,
  effect: 1.15,
  type: TYPE.buff,
};

export const CONCENTRATION = {
  id: UI.CONCENTRATION_BUFF,
  effect: 0.8,
  type: TYPE.buff,
};

// Debuffs
export const FROSTBITE = {
  id: UI.FROSTBITE_DEBUFF,
  duration: 5000,
  speed_effect: 0.4,
  effect: 1.5,
  getDamageEffect: (hasRelic: boolean) => (hasRelic ? 0.5 : 0.7),
  type: TYPE.debuff,
};

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
