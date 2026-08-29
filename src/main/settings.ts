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

const scale = false;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  title: 'Embercrest Rising',
  version: '1.0.0-beta.3',
  disableContextMenu: true,
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
  },
  scale: {
    parent: 'app',
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
    mode: scale ? Phaser.Scale.FIT : Phaser.Scale.NONE,
    autoCenter: scale ? Phaser.Scale.CENTER_BOTH : Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: WORLD_PARAMS.GRAVITY },
      debug: false,
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
  ],
};
