import { SPELLS } from './asset-keys';
import { SCENE_SIZE } from './scene-size';

// Spell
export const SPELL_UI = {
  X: 409,
  Y: 615,
  WIDTH: 182,
  HEIGHT: 32,
} as const;

// Inventory
export const INVENTORY_UI = {
  X: 10,
  Y: 615,
  WIDTH: 126,
  HEIGHT: 30,
} as const;

// Store
export const STORE_UI = {
  BG: {
    X: SCENE_SIZE.WIDTH / 2,
    Y: SCENE_SIZE.HEIGHT / 2,
    WIDTH: 550,
    HEIGHT: 260,
  },
  EXIT_BUTTON: {
    X: 249.5,
    Y: -105.5,
    WIDTH: 33,
    HEIGHT: 33,
  },
  MASK: {
    X: 252,
    Y: 337,
    WIDTH: 496,
    HEIGHT: 180,
    RADIUS: 10,
  },
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

// Coin Icon
export const COIN_UI = {
  X: 10,
  Y: 60,
  COUNT_X: 42,
  COUNT_Y: 60,
} as const;

// Modifier Icons
export const MODIFIER_ICONS = {
  ICON_SIZE: 32,
  PADDING: 8,
  START_X: 50,
  BUFF_Y: 120,
  DEBUFF_Y: 180,
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

// Spell Icons
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

export const WIND_ICON = {
  X: ICON_X_FIRST + 2 * X_STEP,
  Y: ICON_Y,
} as const;

export const FROST_BOLT_ICON = {
  X: ICON_X_FIRST + 3 * X_STEP,
  Y: ICON_Y,
} as const;

export const ICON_OVERLAYS = {
  [SPELLS.FIRE_BALL]: FIREBALL_ICON,
  [SPELLS.BLINK]: BLINK_ICON,
  [SPELLS.WIND]: WIND_ICON,
  [SPELLS.FROST_BOLT]: FROST_BOLT_ICON,
} as const;

// Inventory Slots
export const INVENTORY_SLOTS = {
  WIDTH: 16,
  HEIGHT: 24,
  PADDING: 16,
  START_X: 17,
  Y: 615,
} as const;

// Dialog box

export const WARNING_BOX = {
  BG: {
    X: SCENE_SIZE.WIDTH / 2,
    Y: SCENE_SIZE.HEIGHT / 3,
    WIDTH: 274,
    HEIGHT: 70,
  },
  YES_BTN: {
    X: -24,
    Y: 15,
    WIDTH: 78,
    HEIGHT: 14,
  },
  NO_BTN: {
    X: 75,
    Y: 15,
    WIDTH: 78,
    HEIGHT: 14,
  },
};

// Warning Text
export const WARNING_TEXT = {
  START_Y: 100,
  PADDING: 30,
} as const;
