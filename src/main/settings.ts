import { PreloadScene } from '@/scenes/preload';
import { UiScene } from '@/scenes/ui-scene';
import { LevelOneScene } from '@/scenes/level-one-scene';
import { WORLD_PARAMS } from '@/constants/world-params';
import { SCENE_SIZE } from '@/constants/scene-size';
import { MainMenuScene } from '@/scenes/main-menu';
import { IntroScene } from '@/scenes/intro-scene';
import { StartGameScene } from '@/scenes/start-game-scene';
import { VictoryScene } from '@/scenes/victory-scene';
import { OutroScene } from '@/scenes/outro-scene';

const fullScreen = false;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#eeeeee',
  title: 'Phantom hollow',
  version: '0.15.1',
  scale: {
    parent: 'app',
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
    mode: fullScreen ? Phaser.Scale.FIT : Phaser.Scale.NONE,
    autoCenter: fullScreen ? Phaser.Scale.CENTER_BOTH : Phaser.Scale.NONE,
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
    IntroScene,
    UiScene,
    LevelOneScene,
    StartGameScene,
    VictoryScene,
    OutroScene,
  ],
};
