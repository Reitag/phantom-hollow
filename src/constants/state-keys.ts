export const PLAYER_STATES = {
  IDLE: 'Idle',
  READY: 'Ready',
  CASTING: 'Casting',
  MOVEMENT: 'Movement',
} as const;

export const ENEMY_STATES = {
  ATTACK: 'Attack',
  RANGE_ATTACK: 'Range-Attack',
  CASTING: 'Casting',
  CHASE: 'Chase',
  HOVER: 'Hover',
  DIVE: 'Dive',
  PATROL: 'Patrol',
  WAIT: 'Wait',
} as const;

export const SHARED_STATES = {
  IDLE: 'Idle',
  DEATH: 'Death',
} as const;
