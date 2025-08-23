export const PLAYER = {
  LEFT: 'left',
  RIGHT: 'right',
  IDLE: 'idle',
  SIMPLE_ATTACK: 'simple-attack',
  DEATH: 'death',
} as const;

export const SPELLS = {
  FIRE_BALL: {
    MAIN: 'fire-ball-anim',
    DESTROY: 'fire-ball-anim-destroy',
  },
  BLINK: {
    MAIN: 'blink-anim',
  },
} as const;

export const ENEMIES = {
  SKELETON_WARRIOR: {
    LEFT: 'sk-warrior-left',
    RIGHT: 'sk-warrior-right',
    IDLE: 'sk-warrior-idle',
    SIMPLE_ATTACK: 'sk-warrior-simple-attack',
    HURT: 'sk-warrior-hurt',
    DEATH: 'sk-warrior-death',
  },
  ZOMBIE: {
    LEFT: 'zombie-left',
    RIGHT: 'zombie-right',
    IDLE: 'zombie-idle',
    SIMPLE_ATTACK: 'zombie-simple-attack',
    HURT: 'zombie-hurt',
    DEATH: 'zombie-death',
  },
} as const;

export const PORTAL = {
  SPIN: 'portal-spin',
} as const;
