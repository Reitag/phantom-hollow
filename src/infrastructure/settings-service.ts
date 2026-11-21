import { GameSettings } from '@/utils/types';

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.4, // 40% Volume
  sfxVolume: 0.8, // 80% Volume
  fullscreen: false, // window mode
};

export class SettingsService {
  private static SETTINGS_KEY = 'embercrest-rising-settings';
  private static currentSettings: GameSettings = { ...DEFAULT_SETTINGS };

  static get data(): GameSettings {
    return this.currentSettings;
  }

  static load(): GameSettings {
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      if (!raw) {
        this.currentSettings = { ...DEFAULT_SETTINGS };
        return this.currentSettings;
      }

      const parsed = JSON.parse(raw);
      this.currentSettings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    } catch {
      this.currentSettings = { ...DEFAULT_SETTINGS };
    }

    if (!window.electronAPI && this.currentSettings.fullscreen) {
      this.currentSettings.fullscreen = false;
      this.commit();
    }

    return this.currentSettings;
  }

  static patch(data: Partial<GameSettings>): void {
    this.currentSettings = {
      ...this.currentSettings,
      ...data,
    };
    this.commit();
  }

  static commit(): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.currentSettings));
    } catch {
      throw new Error('Failed to save settings to localStorage:');
    }
  }

  static reset(): void {
    this.currentSettings = { ...DEFAULT_SETTINGS };
    this.commit();
  }
}
