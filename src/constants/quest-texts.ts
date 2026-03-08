import { hastePotion } from '@/game/items/potions';

const shadow = {
  offsetX: 0,
  offsetY: 1,
  color: 'rgba(0,0,0,0.6)',
  blur: 2,
  fill: true,
};

export const QUEST_TEXT_STYLE = {
  NAME: {
    font: '18px Cinzel',
    color: '#e6c68a',
    shadow: shadow,
  },
  TITLE: {
    font: '16px EB Garamond',
    color: '#d4af6a',
    shadow: shadow,
  },
  TEXT: {
    font: '14px EB Garamond',
    color: '#d2c5b0',
    wordWrap: {
      width: 249,
    },
    shadow: shadow,
  },
  REWARD_TITLE: {
    color: '#c9a24d',
  },
} as const;

export const ALCHEMIST_QUEST_TEXT = {
  NAME: 'Octius, the Wandering Alchemist',
  TITLE: "Blazeworm's Fang",
  PENDING: `Greetings! A fellow wanderer...? No... A local, and you emanate a daring spirit!

My name is Octius, I came from afar. My devotion is alchemy, it makes me explore the world in search of rare potion ingredients.

You know of a Blazeworm lurking beneath these highlands, don't you? Its precious fang is what I'm after.

Slay the beast, help me obtain the fang, and I will make it worth your while. Ever dreamed of being fast as the wind?`,
  COMPLETED: `What a majectic mage! You have proven that a force of will and discipline is more dangerous than crude anger and muscle.

I love it the most when my travels cross my path with heroic fellows, like yourself. You helped me greatly.

I keep my promises. Please accept this Haste Potion and chase the wind itself.

Till we will meet again!`,
  OBJECTIVES: {
    TITLE: 'Objectives',
    TEXT: 'Collect 1 Blazeworm Fang and return it to Octius.',
  },
  REWARD: {
    TITLE: 'Reward',
    ITEM: {
      TITLE: `${hastePotion().name}`,
      DESCRIPTION: `${hastePotion().description}`,
    },
    COMPLETED_TEXT: 'You will recieve:',
  },
} as const;
