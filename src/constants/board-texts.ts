import { hastePotion } from '@/game/items/potions';

export const LETTER_TEXT_WIDTH = 390;
export const QUEST_TEXT_WIDTH = 249;

const shadow = {
  offsetX: 0,
  offsetY: 1,
  color: 'rgba(0,0,0,0.6)',
  blur: 2,
  fill: true,
};

export const textStyle = (textWidth: number) => {
  return {
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
        width: textWidth,
      },
      shadow: shadow,
    },
    REWARD_TITLE: {
      color: '#c9a24d',
    },
  };
};

// Letter
export const GREETING_LETTER_TEXT = {
  NAME: 'Guild of Mages',
  TITLE: 'Greeting Letter',
  TEXT: `Greetings!

Your studies at the Guild Of Mages have now began. You learned well the basics of spells that could save your life but, most importantly, could save our world too.

Danger always looms over our lands, so head out and seize an opportunity to prove yourself in battle.

Survive, slay, become our pride and joy. Remember, there is more to power than mere muscle.

You are learning to wield the energy of life itself - magic - the greatest of powers.`,
} as const;

// Quest
export const ALCHEMIST_QUEST_TEXT = {
  NAME: 'Octius, the Wandering Alchemist',
  TITLE: "Blazeworm's Fang",
  PENDING: `Greetings! A fellow wanderer...? No... A local, and you emanate a daring spirit!

My name is Octius, I came from afar. My devotion is alchemy, it makes me explore the world in search of rare potion ingredients.

You know of a Blazeworm lurking deep in the Wyrmsigil Cave beneath these highlands, don’t you? Its precious fang is what I'm after.

Slay the beast, help me obtain the fang, and I will make it worth your while. Ever dreamed of being as fast as the wind?`,
  COMPLETED: `What a majestic mage! You have proven that a force of will and discipline is more dangerous than crude anger and muscle.

I love it the most when my travels cross my path with heroic fellows, like yourself. You helped me greatly.

I keep my promises. Please accept this Haste Potion and chase the wind itself.

Till we meet again!`,
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
