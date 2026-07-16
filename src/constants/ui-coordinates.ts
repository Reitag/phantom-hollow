import { SCENE_SIZE } from './scene-size';

// Store
export const STORE_UI = {
  EXIT_BUTTON: {
    X: 768.5,
    Y: 26.5,
    WIDTH: 33,
    HEIGHT: 33,
  },
  ITEM_CARD: {
    ICON: {
      X: 25.5,
      Y: 28.5,
    },
    NAME: {
      X: 52,
      Y: 13,
    },
    PRICE: {
      X: 52,
      Y: 30,
    },
    TEXT: {
      X: 15,
      Y: 65,
    },
  },
} as const;

// Quest
export const QUEST_UI = {
  ACCEPT_BTN: {
    X: 80,
    Y: 390,
  },
  DECLINE_BTN: {
    X: 270,
    Y: 390,
  },
  COMPLETE_BTN: {
    X: 179.5,
    Y: 390,
  },
} as const;

// Letter
export const LETTER_UI = {
  CLOSE_BTN: {
    X: 220,
    Y: 390,
  },
} as const;

// Quest log
export const QUEST_LOG_UI = {
  ASIDE: {
    X: 502,
    Y: 38,
  },
  CLOSE_BTN: {
    X: 502,
    Y: 348,
  },
} as const;

// Tutorial
export const TUTORIAL_UI = {
  PREV_BTN: {
    X: 251,
    Y: 464,
  },
  CLOSE_BTN: {
    X: 375,
    Y: 464,
  },
  NEXT_BTN: {
    X: 494,
    Y: 464,
  },
} as const;

// Interact tooltip
export const INTERACT_TOOLTIP = {
  X: 415,
  Y: 580,
  WIDTH: 170,
  FILL_COLOR: 0x000000,
} as const;

// Dialog box
export const WARNING_BOX = {
  BG: {
    X: SCENE_SIZE.WIDTH / 2,
    Y: SCENE_SIZE.HEIGHT / 3,
    WIDTH: 274,
    HEIGHT: 70,
  },
  BUTTON_OFFSET_Y: 25,
  BUTTONS_SPACING: 130,
};

// Warning Text
export const WARNING_TEXT = {
  START_Y: 100,
  PADDING: 30,
} as const;
