import { UI } from './asset-keys';

export const SHIFT_SPELL_REGGISTER_HITS = 1000;

export const SPIKE_HIT = 10;

export const SPEAR_HIT = 50;

export const FIRE_BALL_STATS = {
  HIT: 25,
  //HIT: 2500,
  SPEED: 300,
  CAST_TIME: 800,
  LIFE_TIME: 1100,
} as const;

export const BLINK_STATS = {
  DISTANCE: 300,
  DELAY: 500,
} as const;

export const WIND_WAVE_STATS = {
  FORCE: 300,
} as const;

export const FROST_BOLT_STATS = {
  HIT: 5,
  SPEED: 300,
  CAST_TIME: 500,
  LIFE_TIME: 1100,
} as const;

export const DREAD_AURA_STATS = {
  KEY_NAME: UI.DREAD_AURA_DEBUFF,
  DAMAGE: 5,
  RANGE: 250,
};

export const SHADOW_BOLT_STATS = {
  HIT: 15,
  SPEED: 300,
  CAST_TIME: 500,
  LIFE_TIME: 2000,
} as const;

export const SHADOW_TRAIL_STATS = {
  HIT: 20,
  SPEED: 300,
  LIFE_TIME: 1100,
} as const;

export const LIGHTNING_SHIELD_STATS = {
  HIT: 5,
} as const;

export const EARTH_SHAKE_STATS = {
  HIT: 20,
} as const;

export const ARROW_STATS = {
  HIT: 10,
  SPEED: 400,
  LIFE_TIME: 3000,
} as const;

export const CRYSTAL_SHRINE_STATS = {
  KEY_NAME: UI.CRYSTAL_RENEWAL_BUFF,
  HEAL: 15,
} as const;

export const PLAYER_STATS = {
  HEALTH: 200,
  //HEALTH: 3000,
  MOVE: 190,
  JUMP: 550,
  SPELL_POWER: 4,
} as const;

export const SKELETON_WARRIOR_STATS = {
  HEALTH: 200,
  WALK_BOUND: 50,
  ENGAGE_DISTANCE: 200,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 4,
  HIT: 25,
  SAME_Y_THRESHOLD: 10,
  WALK: 60,
  CHASE: 1.3,
} as const;

export const ZOMBIE_STATS = {
  HEALTH: 300,
  WALK_BOUND: 70,
  ENGAGE_DISTANCE: 200,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 3,
  HIT: 15,
  SAME_Y_THRESHOLD: 10,
  WALK: 50,
  CHASE: 1.3,
} as const;

export const ARCHER_STATS = {
  HEALTH: 100,
  ENGAGE_DISTANCE: 415,
  FRAME_ON_HIT: 1,
  SAME_Y_THRESHOLD: 40,
} as const;

export const MUTATED_BAT_STATS = {
  HEALTH: 10,
  FLY: 70,
  CHASE: 2,
  HIT: 10,
  LIFE_TIME: 1500,
  DELAY: 8000,
} as const;

export const FIRE_WORM_STATS = {
  HEALTH: 1000,
  WALK_BOUND: 100,
  WALK: 7,
  ENGAGE_DISTANCE: 450,
  CAST: 13,
  SPELL_POWER: 5,
} as const;

export const EVIL_WIZARD_STATS = {
  HEALTH: 2500,
  WALK_BOUND: 100,
  WALK: 50,
  ENGAGE_DISTANCE: 450,
  CAST: 10,
  SPELL_POWER: 6,
} as const;
