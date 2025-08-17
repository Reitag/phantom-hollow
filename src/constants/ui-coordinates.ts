import { SPELLS } from './asset-keys';

// Spell
export const SPELL_UI = {
  X: 409,
  Y: 615,
  WIDTH: 182,
  HEIGHT: 32,
} as const;

// Health
export const HEALTH_UI = {
  X: 10,
  Y: 20,
  WIDTH: 194,
  HEIGHT: 22,
} as const;

export const HEALTH_BAR = {
  X: HEALTH_UI.X + 35,
  Y: HEALTH_UI.Y,
  WIDTH: 157,
  HEIGHT: 6,
} as const;

// Cast
export const CAST_UI = {
  X: 410,
  Y: 580,
  WIDTH: 180,
  HEIGHT: 12,
} as const;

export const CAST_BAR = {
  X: CAST_UI.X + 2,
  Y: CAST_UI.Y,
  WIDTH: 176,
  HEIGHT: 8,
} as const;

// Icons
const ICON_X_FIRST = 427;
const X_STEP = 50;
const ICON_Y = 615;

export const FIREBALL_ICON = {
  X: ICON_X_FIRST,
  Y: ICON_Y,
} as const;

export const BLINK_ICON = {
  X: ICON_X_FIRST + X_STEP,
  Y: ICON_Y,
} as const;

export const ICON_OVERLAYS = {
  [SPELLS.FIRE_BALL]: FIREBALL_ICON,
  [SPELLS.BLINK]: BLINK_ICON,
} as const;
