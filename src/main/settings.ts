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
  version: '0.16.0',
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
