import { QuestState, SaveGame } from '@/utils/types';

const DEFAULT_SAVE: SaveGame = {
  scene: undefined,
  spawn: null,
  inventory: [],
  health: undefined,
  coins: 0,
  buffs: [],
  quests: {},
  worldState: {
    openedChest: [],
    killedBosses: [],
    droppedLoot: [],
  },
};

export class SaveService {
  private static SAVE_KEY = 'game-save';

  private static currentSave: SaveGame = structuredClone(DEFAULT_SAVE);

  // Access current save object
  static get data(): SaveGame {
    return this.currentSave;
  }

  // Load save from localStorage into memory
  static load(): SaveGame {
    const data = localStorage.getItem(this.SAVE_KEY);

    if (!data) {
      this.currentSave = structuredClone(DEFAULT_SAVE);
      return this.currentSave;
    }

    this.currentSave = {
      ...DEFAULT_SAVE,
      ...JSON.parse(data),
    };

    return this.currentSave;
  }

  // Save memory object to localStorage (checkpoint)
  static commit(): void {
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.currentSave));
  }

  // Update fields in memory only
  static patch(data: Partial<SaveGame>): void {
    this.currentSave = {
      ...this.currentSave,
      ...data,
    };
  }

  static setQuestState(questId: string, state: QuestState) {
    const quests = this.currentSave.quests ?? {};
    quests[questId] = state;

    this.patch({ quests });
  }

  static getQuestState(questId: string): QuestState {
    return this.currentSave.quests?.[questId] ?? 'pending';
  }

  static hasSave(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  static clear(isTotalRemove = false): void {
    if (isTotalRemove) {
      localStorage.removeItem(this.SAVE_KEY);
    }

    this.currentSave = structuredClone(DEFAULT_SAVE);
  }
}
