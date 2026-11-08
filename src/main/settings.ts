import { PreloadScene } from '@/scenes/preload';
import { UiScene } from '@/scenes/ui-scene';
import { LevelOneScene } from '@/scenes/level-one-scene';
import { WORLD_PARAMS } from '@/constants/world-params';
import { SCENE_SIZE } from '@/constants/scene-size';
import { MainMenuScene } from '@/scenes/main-menu';
import { IntroScene } from '@/scenes/intro-scene';
import { PauseScene } from '@/scenes/pause-scene';
import { OptionsScene } from '@/scenes/options-scene';
import { CreditsScene } from '@/scenes/credits-scene';
import { EndScoreScene } from '@/scenes/end-score-scene';

const isDev = process.env.NODE_ENV === 'development';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  title: 'Embercrest Rising',
  version: '1.0.0-rc.1',
  disableContextMenu: true,
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  scale: {
    parent: 'app',
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: isDev ? Phaser.Scale.NO_CENTER : Phaser.Scale.CENTER_BOTH,
    min: {
      width: 1024,
      height: 640,
    },
    max: {
      width: 1280,
      height: 896,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: WORLD_PARAMS.GRAVITY },
      tileBias: 32,
      debug: isDev,
    },
  },
  callbacks: {
    preBoot: function (game) {
      game.audioService = {
        musicVolume: 0,
        sfxVolume: 0,

        music: {
          play: (key, config = {}) => {
            const finalConfig = Object.assign({ volume: game.audioService.musicVolume }, config);
            const sound = game.sound.add(key, finalConfig);

            sound.isMusic = true;
            sound.play();
            sound.once('complete', () => sound.destroy());

            return sound;
          },
          setVolume: (volume) => {
            game.audioService.musicVolume = volume;
          },
        },

        sfx: {
          play: (key, config = {}) => {
            const finalConfig = Object.assign({ volume: game.audioService.sfxVolume }, config);
            const sound = game.sound.add(key, finalConfig);
            sound.play();
            sound.once('complete', () => sound.destroy());

            return sound;
          },
          setVolume: (volume) => {
            game.audioService.sfxVolume = volume;
          },
        },
      };
    },
  },
  scene: [
    PreloadScene,
    MainMenuScene,
    OptionsScene,
    CreditsScene,
    IntroScene,
    UiScene,
    LevelOneScene,
    PauseScene,
    EndScoreScene,
  ],
};
