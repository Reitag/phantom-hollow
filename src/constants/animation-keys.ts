export const CHARACTER_ANIMATION_KEYS = {
  IDLE: 'IDLE',
  MOVE: 'MOVE',
  RUN: 'RUN',
  JUMP: 'JUMP',
  FALL: 'FALL',
  ATTACK: 'ATTACK',
  CAST: {
    CAST_START: 'CAST_START',
    CAST_MAIN: 'CAST_MAIN',
    CAST_END: 'CAST_END',
    INSTANT_CAST: 'INSTANT_CAST',
  },
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

export const VFX_ANIMATION_KEYS = {
  START: 'START',
  MAIN: 'MAIN',
  END: 'END',
};

export const PLAYER_ANIMATION = {
  [CHARACTER_ANIMATION_KEYS.IDLE]: 'player-idle',
  [CHARACTER_ANIMATION_KEYS.MOVE]: 'player-move',
  [CHARACTER_ANIMATION_KEYS.JUMP]: 'player-jump',
  [CHARACTER_ANIMATION_KEYS.FALL]: 'player-fall',
  [CHARACTER_ANIMATION_KEYS.CAST.CAST_START]: 'player-cast-start',
  [CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN]: 'player-cast-main',
  [CHARACTER_ANIMATION_KEYS.CAST.CAST_END]: 'player-cast-end',
  [CHARACTER_ANIMATION_KEYS.CAST.INSTANT_CAST]: 'player-instant-cast',
  [CHARACTER_ANIMATION_KEYS.DEATH]: 'player-death',
} as const;

export const NPC_ANIMATION = {
  ALCHEMIST: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'alchemist-idle',
  },
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
  FIRE_WORM: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'fire-worm-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'fire-worm-move',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_START]: 'fire-worm-cast-start',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN]: 'fire-worm-cast-main',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_END]: 'fire-worm-cast-end',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'fire-worm-death',
  },
  EVIL_WIZARD: {
    [CHARACTER_ANIMATION_KEYS.IDLE]: 'evil-wizard-idle',
    [CHARACTER_ANIMATION_KEYS.MOVE]: 'evil-wizard-move',
    [CHARACTER_ANIMATION_KEYS.RUN]: 'evil-wizard-run',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_START]: 'evil-wizard-cast-start',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN]: 'evil-wizard-cast-main',
    [CHARACTER_ANIMATION_KEYS.CAST.CAST_END]: 'evil-wizard-cast-end',
    [CHARACTER_ANIMATION_KEYS.DEATH]: 'evil-wizard-death',
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
  LIGHTNING_SHIELD: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'lightning-shield-main',
  },
  WIND_WAVE: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'wind-main',
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
  EARTH_SHAKE: {
    [SPELL_ANIMATION_KEYS.MAIN]: 'earth-shake-main',
  },
  SHADOW_TRAIL: {
    [SPELL_ANIMATION_KEYS.START]: 'shadow-trail-start',
    [SPELL_ANIMATION_KEYS.MAIN]: 'shadow-trail-main',
    [SPELL_ANIMATION_KEYS.HIT]: 'shadow-trail-hit',
  },
} as const;

export const VFX_ANIMATION = {
  FREEZE: {
    [VFX_ANIMATION_KEYS.MAIN]: 'freeze-vfx-main',
    [VFX_ANIMATION_KEYS.END]: 'freeze-vfx-end',
  },
  RESPAWN: {
    [VFX_ANIMATION_KEYS.MAIN]: 'respawn-vfx-main',
  },
  HEAL: {
    [VFX_ANIMATION_KEYS.MAIN]: 'heal-vfx-main',
  },
  PROTECTION: {
    [VFX_ANIMATION_KEYS.MAIN]: 'protection-vfx-main',
  },
  SPELL: {
    [VFX_ANIMATION_KEYS.MAIN]: 'spell-vfx-main',
  },
  UNDYING: {
    [VFX_ANIMATION_KEYS.MAIN]: 'undying-vfx-main',
  },
  ARCANE_MIND: {
    [VFX_ANIMATION_KEYS.MAIN]: 'arcane-mind-vfx-main',
  },
  CONCENTRATION: {
    [VFX_ANIMATION_KEYS.MAIN]: 'concentration-vfx-main',
  },
  EARTH_ANXIETY: {
    [VFX_ANIMATION_KEYS.MAIN]: 'earth-anxiety-vfx-main',
  },
  EVIL_WIZARD_DISAPPEARS: {
    [VFX_ANIMATION_KEYS.MAIN]: 'evil-wizard-disappears-vfx-main',
  },
  EVIL_WIZARD_APPEARS: {
    [VFX_ANIMATION_KEYS.MAIN]: 'evil-wizard-appears-vfx-main',
  },
} as const;

export const MISC_ANIMATION = {
  SOUL_FIRE: {
    [VFX_ANIMATION_KEYS.START]: 'soul-fire-start',
    [VFX_ANIMATION_KEYS.MAIN]: 'soul-fire-main',
  },
  BON_FIRE: {
    [VFX_ANIMATION_KEYS.MAIN]: 'bonfire-main',
  },
  SHINING: {
    [VFX_ANIMATION_KEYS.MAIN]: 'shining-main',
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
