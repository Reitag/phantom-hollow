export const SPIKE_HIT = 10;

export const SPEAR_HIT = 50;

export const FIRE_BALL_STATS = {
  HIT: 120,
  SPEED: 300,
  LIFE_TIME: 1100,
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
  PATROL: 60,
  CHASE: 160,
} as const;

export const ZOMBIE_STATS = {
  HEALTH: 300,
  WALK_BOUND: 500,
  ENGAGE_DISTANCE: 500,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 3,
  HIT: 15,
  SAME_Y_THRESHOLD: 40,
  PATROL: 50,
  CHASE: 150,
} as const;
