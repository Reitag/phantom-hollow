import 'phaser';

declare global {
  interface Window {
    electronAPI?: {
      setFullscreen(flag: boolean): void;
      getFullscreen(): Promise<boolean>;
    };
  }

  namespace Phaser {
    interface Game {
      audioService: {
        musicVolume: number;
        sfxVolume: number;

        music: {
          play(key: string, config?: Phaser.Types.Sound.SoundConfig): Phaser.Sound.BaseSound;
          setVolume(volume: number): void;
        };

        sfx: {
          play(key: string, config?: Phaser.Types.Sound.SoundConfig): Phaser.Sound.BaseSound;
          setVolume(volume: number): void;
        };
      };
    }
    namespace Sound {
      interface BaseSound {
        isMusic?: boolean;
      }
      interface NoAudioSound {
        isMusic?: boolean;
      }
      interface HTML5AudioSound {
        isMusic?: boolean;
      }
      interface WebAudioSound {
        isMusic?: boolean;
      }
    }
  }
}
