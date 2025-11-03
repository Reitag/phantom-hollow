export const CHARACTER_ANIMATION_KEYS = {
  IDLE: 'IDLE',
  MOVE: 'MOVE',
  RUN: 'RUN',
  ATTACK: 'ATTACK',
  CAST: 'CAST',
  INSTANT_CAST: 'INSTANT_CAST',
  RANGED_UPPER_ATTACK: 'RANGED_UPPER_ATTACK',
  RANGED_STRAIGHT_ATTACK: 'RANGED_STRAIGHT_ATTACK',
  RANGED_DOWN_ATTACK: 'RANGED_DOWN_ATTACK',
  DEATH: 'DEATH',
};

export const SPELL_ANIMATION_KEYS = {
  START: 'START',
  MAIN: 'MAIN',
  HIT: 'HIT',
};

export const EFFECT_ANIMATION_KEYS = {
  START: 'START',
  MAIN: 'MAIN',
  END: 'END',
};

export const PLAYER_ANIMATION = {
  [CHARACTER_ANIMATION_KEYS.IDLE]: 'player-idle',
  [CHARACTER_ANIMATION_KEYS.MOVE]: 'player-move',
  [CHARACTER_ANIMATION_KEYS.CAST]: 'player-cast',
  [CHARACTER_ANIMATION_KEYS.INSTANT_CAST]: 'player-instant-cast',
  [CHARACTER_ANIMATION_KEYS.DEATH]: 'player-death',
} as const;

export const ENEMIES_ANIMATION = {
  SKELETON_WARRIOR: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'sk-warrior-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'sk-warrior-move',
    [CHARACTER_ANIMATION_KEYS.ATTACK]: 'sk-warrior-attack',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'sk-warrior-death',
  },
  ZOMBIE: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'zombie-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'zombie-move',
    [CHARACTER_ANIMATION_KEYS.ATTACK]: 'zombie-attack',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'zombie-death',
  },
  ARCHER: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'archer-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'archer-move',
    [CHARACTER_ANIMATION_KEYS.RANGED_UPPER_ATTACK]: 'archer-ranged-upper-attack',
    [CHARACTER_ANIMATION_KEYS.RANGED_STRAIGHT_ATTACK]: 'archer-ranged-straight-attack',
    [CHARACTER_ANIMATION_KEYS.RANGED_DOWN_ATTACK]: 'archer-ranged-down-attack',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'archer-death',
  },
  MUTADED_BAT: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'bat-idle',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'bat-death',
  },
} as const;

export const BOSSES_ANIMATION = {
  EVIL_WIZARD: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'evil-wizard-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'evil-wizard-move',
    [CHARACTER_ANIMATION_KEYS.RUN]: 'evil-wizard-run',
    [CHARACTER_ANIMATION_KEYS.CAST]: 'evil-wizard-cast',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'evil-wizard-death',
  },
  FIRE_WORM: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'fire-worm-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'fire-worm-move',
    [CHARACTER_ANIMATION_KEYS.CAST]: 'fire-worm-cast',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'fire-worm-death',
  },
} as const;

export const SPELLS_ANIMATION = {
  FIRE_BALL: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'fire-ball-main',
    [SPELL_ANIMATION_KEYS.HIT]: 'fire-ball-hit',
  },
  BLINK: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'blink-main',
  },
  WIND: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'wind-main',
    [SPELL_ANIMATION_KEYS.HIT]: 'wind-hit',
  },
  FROST_BOLT: {
    [SPELL_ANIMATION_KEYS.START]: 'frost-bolt-start',
    [SPELL_ANIMATION_KEYS.MAIN]: 'frost-bolt-main',
    [SPELL_ANIMATION_KEYS.HIT]: 'frost-bolt-hit',
  },
  SHADOW_BOLT: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'shadow-bolt-main',
    [SPELL_ANIMATION_KEYS.HIT]: 'shadow-bolt-hit',
  },
} as const;

export const EFFECTS_ANIMATION = {
  FREEZE: {
    [EFFECT_ANIMATION_KEYS.MAIN]: 'freeze-main',
    [EFFECT_ANIMATION_KEYS.END]: 'freeze-end',
  },
} as const;

export const ITEMS_ANIMATION = {
  COIN: {
    IDLE: 'coin-idle',
  },
};

export const PORTAL_ANIMATION = {
  SPIN: 'portal-spin',
} as const;

export const DARK_ENERGY_ANIMATION = {
  IDLE: 'dark-energy-idle',
} as const;
