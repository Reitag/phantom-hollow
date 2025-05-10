export const VELOCITY = {
  WORLD_VELOCITY_Y: 2000,
  PLAYER_VELOCITY: { MOVE: 230, JUMP: 730 },
};

export const SCENE_SIZE = {
  WIDTH: 800,
  HEIGHT: 640,
};

export const WORLD_BOUND = {
  WIDTH: 4800,
  HEIGHT: SCENE_SIZE.HEIGHT,
};

export const CHARACTER_STATES = Object.freeze({
  IDLE: 'idle',
  WALK: 'walk',
  CHASE: 'chase',
  ATTACK: 'attack',
});
