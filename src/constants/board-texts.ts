import { hastePotion } from '@/game/items/potions';
import { stoneOfConcentration } from '@/game/items/stones';

//export const BOARD_TEXT_WIDTH = 600;
export const BOARD_TEXT_WIDTH = 570;
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
      font: '700 22px Cinzel',
      color: '#ffcc00',
      align: 'center',
      shadow: shadow,
    },
    TEXT: {
      font: '18px EB Garamond',
      color: '#d1d1d1',
      align: 'left',
      wordWrap: {
        width: textWidth,
      },
      lineSpacing: 4,
      shadow: shadow,
    },
  };
};

// Intro text
export const INTRO_TEXT = {
  TEXT: `
  Our Kingdom has endured much, paving a way to generations of mighty mages, warriors, craftsmen, and artists.

  King Ramon Tarenval, once our pride, has grown old and weary. Word spreads, and old foes are among those who listen.

  Beauty of Embercrest Highlands, a province of tranquility and ancient wisdom, is soon tarnished by evil presence.

  The darkest hour. A call to arms. A young hero emerges. A turning point closes by, before our eyes...

  ~ From "The Book Of Triumphs", The Guild Of Mages Holy Library ~
`,
} as const;

// Start Game
export const START_GAME_TEXT = {
  NAME: 'Hokki Silverfir',
  TEXT: `I greet you, mage! I am Hokki Silverfir, our commune's chieftain.

It is my duty to summon our bravest to crush a looming threat in this hour of peril.

Nearby, the ancient Stonedawn Ruins have fallen to a warlock known as Sacryth the Duskbringer.

She and her undead hordes covet the divine energy that flows through our lands.

I charge you to put an end to her deadly march!`,
} as const;

// End Game
export const END_GAME_TEXT = {
  NAME: 'VICTORY',
  TEXT: `You have done us proud, mage! Sacryth is dead, and Embercrest can finally breathe easy, though I foretell a more menacing storm yet brewing on the horizon. This war has only just begun...

It is rare to see a mage fight with a grit equal to that of a sword master. Your magick is indeed a formidable weapon, and we are glad to have it on our side. Keep your guard up on the road ahead!`,
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
  TITLE: 'Arcane Crystals',
  PENDING: `Hear our voice, stranger... You seek to channel the divine power your kind calls magick, do you not?

Your kind finds itself in another bloodshed. Humans are truly creatures of chaos. Yet chaos cannot bend the laws of the arcane.

Prove yourself worthy by bringing shards of the arcane crystals to The Shining. And earn a reward that no fellow human can provide...`,
  COMPLETED: `Magnificent. The fragments have reunited, and the arcane flow within the stone is aligned in harmony once again.

While the clash of mortals again shakes your ever changing world to its core, the principles of magick remain absolute.

Thus focus your mind. Let the knowledge guide the divine power through you. You have earned our blessing, stranger...`,
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
