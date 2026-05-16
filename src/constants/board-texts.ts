import { hastePotion } from '@/game/items/potions';
import { stoneOfConcentration } from '@/game/items/stones';

export const BOARD_TEXT_WIDTH = 400;
export const LETTER_TEXT_WIDTH = 390;
export const QUEST_TEXT_WIDTH = 299;

const shadow = {
  offsetX: 0,
  offsetY: 1,
  color: 'rgba(0,0,0,0.2)',
  blur: 1,
  fill: true,
};

export const textStyle = (textWidth: number) => {
  return {
    NAME: {
      font: '700 18px Cinzel',
      color: '#4A2318',
      shadow: { ...shadow, color: 'rgba(0,0,0,0.1)' },
    },
    TITLE: {
      font: '18px EB Garamond',
      color: '#5D4037',
      shadow: shadow,
    },
    TEXT: {
      font: '16px EB Garamond',
      color: '#2A1B12',
      wordWrap: {
        width: textWidth,
      },
      shadow: { ...shadow, opacity: 0.1 },
    },
    REWARD_TITLE: {
      font: '18px Cinzel',
      color: '#836F53',
    },
  };
};

export const boardText = (textWidth: number) => {
  return {
    NAME: {
      font: '700 24px Cinzel',
      color: '#ffcc00',
      align: 'center',
      shadow: shadow,
    },
    TEXT: {
      font: '20px EB Garamond',
      color: '#d1d1d1',
      align: 'center',
      wordWrap: {
        width: textWidth,
      },
      lineSpacing: 8,
      shadow: shadow,
    },
  };
};

// Intro text
export const INTRO_TEXT = {
  TEXT: `
Our Kingdom has endured much and many. Past conflicts with threats from beyond the sea teached us courage and magical discipline, paving a way to generations of mages, warriors, craftsmen, and artists.

But any strong will weakens without an exercise. King Ramon Tarenval, heir of a long dinasty, has grown greedy and cowardly, leading our Kingdom to embrace his sickly example and attracting old foes back to our lands.

Embercrest Highlands, a home of tranquility and ancient wisdom, was shaken by sudden arrival of vile Sacryth The Duskbringer and her minions, ready to feast insatiably on the divine energy we keep dear.

Hokki Silverfir, a local chieftain devoted to defend his land and people from the wielders of dark magic, has called all of us to arms in the darkest hour.

If there is chance at defending the peace and inspiring a change of heart at our Kingdom, it lies with those who believe in light, here and now.

And so, here comes the young apprentice of The Guild Of Mages, urgent to protect their home from evil...

~ From "The Book Of Triumps", The Guild Of Mages Holy Library ~
`,
} as const;

// Start Game
export const START_GAME_TEXT = {
  NAME: 'Hokki Silverfir:',
  TEXT:
    'Our lands are in peril. My scouts have confirmed that Sacryth the Duskbringer is the one behind this chaos.\n\n' +
    'I beg of you — eliminate the warlock.',
} as const;

// End Game
export const END_GAME_TEXT = {
  NAME: 'VICTORY',
  TEXT: 'Sacryth the Duskbringer has been defeated.',
} as const;

// Outro text
export const OUTRO_TEXT = {
  TEXT: 'Thanks for playing',
} as const;

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

// Quests
/// Alchemist
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

/// Shrine
export const CRYSTAL_SHRINE_QUEST_TEXT = {
  NAME: 'Crystal Shrine',
  TITLE: 'Some Title',
  PENDING: `Pending state`,
  COMPLETED: `Completed state`,
  OBJECTIVES: {
    TITLE: 'Objectives',
    TEXT: 'Recover the three lost Arcane Shards and return them to the Shrine.',
  },
  REWARD: {
    TITLE: 'Reward',
    ITEM: {
      TITLE: `${stoneOfConcentration().name}`,
      DESCRIPTION: `${stoneOfConcentration().description}`,
    },
    COMPLETED_TEXT: 'You will recieve:',
  },
} as const;
