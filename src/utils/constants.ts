export const VELOCITY = {
  WORLD_VELOCITY_Y: 2000,
  PLAYER_VELOCITY: { MOVE: 230, JUMP: 730 },
};

export const SCENE_SIZE = {
  WIDTH: 800,
  HEIGHT: 650,
};

export const WORLD_BOUND = {
  WIDTH: 5760,
  HEIGHT: SCENE_SIZE.HEIGHT,
};

export const CHARACTER_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  CHASE: 'chase',
  ATTACK: 'attack',
};

export const SPELLS = {
  GLOBAL: 'global',
  FIREBALL: 'fire-ball',
  BLINK: 'blink',
};

export const SPELLS_COOLDOWNS = {
  GLOBAL: 1000,
  BLINK: 6000,
};

export const DEPTH = {
  // Environment
  /// -backgound
  SKY: 0,
  MOUNTAINS: 10,
  GRASS: 20,
  /// -objects
  TREES_SHADOW: 30,
  TREES_NORMAL: 40,
  BUSH: 50,
  /// -tilesets
  GROUND: 60,
  SPIKE: 70,
  PLATFORMS: 80,

  // Sprite objects
  PORTAL: 110,
  PLAYER: 120,
  ENEMY: 130,
  SPELL: 140,

  // UI
  UI: 1000,
};
