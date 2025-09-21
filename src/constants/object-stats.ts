import { UI } from './asset-keys';

export const SPIKE_HIT = 10;

export const SPEAR_HIT = 50;

export const FIRE_BALL_STATS = {
  HIT: 120,
  SPEED: 300,
  CAST_TIME: 800,
  LIFE_TIME: 1100,
} as const;

export const BLINK_STATS = {
  DISTANCE: 300,
  DELAY: 500,
} as const;

export const WIND_STATS = {
  FORCE: 200,
  SPEED: 300,
  LIFE_TIME: 700,
} as const;

export const DREAD_AURA_STATS = {
  KEY_NAME: UI.DREAD_AURA_DEBUFF,
  DAMAGE: 10,
  RANGE: 250,
};

export const SHADOW_BOLT_STATS = {
  HIT: 30,
  SPEED: 300,
  LIFE_TIME: 2000,
} as const;

export const PLAYER_STATS = {
  HEALTH: 100,
  MOVE: 190,
  JUMP: 510,
} as const;

export const SKELETON_WARRIOR_STATS = {
  HEALTH: 200,
  WALK_BOUND: 470,
  ENGAGE_DISTANCE: 400,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 4,
  HIT: 25,
  SAME_Y_THRESHOLD: 40,
  WALK: 60,
  CHASE: 1.7,
} as const;

export const ZOMBIE_STATS = {
  HEALTH: 300,
  WALK_BOUND: 500,
  ENGAGE_DISTANCE: 500,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 3,
  HIT: 15,
  SAME_Y_THRESHOLD: 40,
  WALK: 50,
  CHASE: 1.7,
} as const;

export const MUTATED_BAT_STATS = {
  HEALTH: 10,
  FLY: 70,
  CHASE: 2,
  HIT: 10,
  LIFE_TIME: 1500,
} as const;

export const EVIL_WIZARD_STATS = {
  HEALTH: 1000,
  ENGAGE_DISTANCE: 400,
} as const;
