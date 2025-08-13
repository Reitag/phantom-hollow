import { SPELLS } from './constants';

// Spell
export const spellUi = {
  x: 409,
  y: 615,
  width: 182,
  height: 32,
};

// Health
export const healthUi = {
  x: 10,
  y: 20,
  width: 194,
  height: 22,
};

export const healthBar = {
  x: healthUi.x + 35,
  y: healthUi.y,
  width: 157,
  height: 6,
};

// Cast
export const castUi = {
  x: 410,
  y: 580,
  width: 180,
  height: 12,
};

export const castBar = {
  x: castUi.x + 2,
  y: castUi.y,
  width: 176,
  height: 8,
};

// Icons
const iconXfirst = 427;
const xStep = 50;
const iconY = 615;

export const fireBallIcon = { x: iconXfirst, y: iconY };
export const blinkIcon = { x: iconXfirst + xStep, y: iconY };

export const iconOverlays = {
  [SPELLS.FIREBALL]: fireBallIcon,
  [SPELLS.BLINK]: blinkIcon,
};
