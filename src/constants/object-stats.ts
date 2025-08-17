export const FIRE_BALL_HIT = 120;

//export const SPIKE_HIT = 10;
export const SPIKE_HIT = 0;

//export const SPEAR_HIT = 50;
export const SPEAR_HIT = 0;

export const SKELETON_WARRIOR_STATS = {
  HEALTH: 200,
  WALK_BOUND: 470,
  ENGAGE_DISTANCE: 400,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 4,
  //HIT: 25,
  HIT: 0,
  SAME_Y_THRESHOLD: 40,
  PATROL: 60,
  CHASE: 120,
} as const;

export const ZOMBIE_STATS = {
  HEALTH: 300,
  WALK_BOUND: 500,
  ENGAGE_DISTANCE: 500,
  ATTACK_RANGE: 20,
  FRAME_ON_HIT: 3,
  //HIT: 15,
  HIT: 0,
  SAME_Y_THRESHOLD: 40,
  PATROL: 50,
  CHASE: 100,
} as const;
