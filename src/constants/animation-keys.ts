export const PLAYER_ANIMATION = {
  LEFT: 'left',
  RIGHT: 'right',
  IDLE: 'idle',
  SIMPLE_ATTACK: 'simple-attack',
  INSTANT_CAST: 'instant-cast',
  DEATH: 'death',
} as const;

export const SPELLS_ANIMATION = {
  FIRE_BALL: {
    MAIN: 'fire-ball-anim',
    DESTROY: 'fire-ball-anim-destroy',
  },
  BLINK: {
    MAIN: 'blink-anim',
  },
  WIND: {
    MAIN: 'wind-anim',
    DESTROY: 'wind-anim-destroy',
  },
} as const;

export const ENEMIES_ANIMATION = {
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

export const PORTAL_ANIMATION = {
  SPIN: 'portal-spin',
} as const;
