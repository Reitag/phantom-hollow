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
    activePedestal: null,
  },
};

export class SaveService {
  private static timer: ReturnType<typeof setInterval>;

  private static SAVE_KEY = 'phantom-hollow-save-data';
  private static isDirty = false;

  private static currentSave: SaveGame = structuredClone(DEFAULT_SAVE);

  static get data(): SaveGame {
    return this.currentSave;
  }

  static start(): void {
    this.timer = setInterval(() => {
      if (this.isDirty) {
        //this.commit();
        this.isDirty = false;
      }
    }, 5000);
  }

  static load(): SaveGame {
    const data = localStorage.getItem(this.SAVE_KEY);

    if (!data) {
      this.currentSave = structuredClone(DEFAULT_SAVE);
      return this.currentSave;
    }

    const parsed = JSON.parse(data);

    this.currentSave = {
      ...DEFAULT_SAVE,
      ...parsed,
      worldState: {
        ...DEFAULT_SAVE.worldState,
        ...parsed.worldState,
      },
    };

    return this.currentSave;
  }

  static commit(): void {
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.currentSave));
  }

  static patch(data: Partial<SaveGame>): void {
    this.currentSave = {
      ...this.currentSave,
      ...data,
    };

    if (!this.isDirty) {
      this.isDirty = true;
    }
  }

  /*static patch(data: Partial<SaveGame>): void {
    this.currentSave = {
      ...this.currentSave,
      ...data,
      worldState: {
        ...this.currentSave.worldState,
        ...data.worldState,
      },
    };

    this.isDirty = true;
  }*/

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
    clearInterval(this.timer);
  }
}
