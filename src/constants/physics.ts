import { SCENE_SIZE } from './scene-size';

export const WORLD_PARAMS = {
  WIDTH: 11200,
  HEIGHT: SCENE_SIZE.HEIGHT,
  GRAVITY: 2000,
} as const;

export const PLAYER_VELOCITY = {
  MOVE: 230,
  JUMP: 730,
} as const;
