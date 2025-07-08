import { SCENE_SIZE, SPELLS } from './constants';

// Background
export const backgoundUi = {
  x: 0,
  y: SCENE_SIZE.HEIGHT - 30,
  width: SCENE_SIZE.WIDTH,
  height: 60,
};

// Health
export const healthUi = {
  x: 30,
  y: 607,
  width: 120,
  height: 12,
};

export const healthBar = {
  x: healthUi.x + 31,
  y: healthUi.y,
  width: healthUi.width,
  height: healthUi.height,
};

// Cast
export const castUi = {
  x: 30,
  y: 633,
  width: 120,
  height: 12,
};

export const castBar = {
  x: castUi.x + 31,
  y: castUi.y,
  width: castUi.width,
  height: castUi.height,
};

// Icons
const iconXfirst = 314;
const xStep = 57;
const iconY = 620;

export const fireBallIcon = { x: iconXfirst, y: iconY };
export const blinkIcon = { x: iconXfirst + xStep, y: iconY };

export const iconOverlays = {
  [SPELLS.FIREBALL]: fireBallIcon,
  [SPELLS.BLINK]: blinkIcon,
};
