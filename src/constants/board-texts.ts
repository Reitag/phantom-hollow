import { hastePotion } from '@/game/items/potions';
import { stoneOfConcentration } from '@/game/items/stones';

export const BOARD_TEXT_WIDTH = 600;
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
  TEXT: `I greet you, o' mage! I am Hokki Silverfir, our commune's chieftain.

   It befalls on my duty to employ the help of our bravest in this time of peril.

   Nearby, the ancient Stonedawn Ruins have fallen to a warlock known as Sacryth the Duskbringer.

   She and her undead minions lust for our vibrant lands overflowing with divine energy.
   
   Scholar of magick, in you we trust to put an end to her deadly march!`,
} as const;

// End Game
export const END_GAME_TEXT = {
  NAME: 'VICTORY',
  TEXT: `You made old Hokki proud! Sacryth the Duskbringer is no more, and Embercrest Highlands could now begin to heal, although the war is far from over...

   It is a joy to us all to witness another hero of our lands emerge, wielding magick as a beacon of light. May that light guide you ever onward, son.`,
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
  PENDING: `Hear our voice, stranger... You are a vessel of divine energy your kind calls magick, are you not?

Contentrate. Hear our word. Your kind finds itself in another bloodshed. Our kind favors sides.

Prove yourself worthy by bringing arcane crystals back shining. And our favor is yours...`,
  COMPLETED: `Mignificent. Arcane energy has once again gave life to stone. Crystals too are vessels of magick.

Vessels, be it stone or man, allow us to propagate into your world. Vessels give us eyes and ears.

And there is much to witness for us, up ahead. Another clash of mortals. Gow restless your kind is. A pity.

Contentrate. It helps magick flow through you. You deserve our blessing for that, stranger...`,
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
