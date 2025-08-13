import Phaser from 'phaser';
import { PreloadScene } from '@/scenes/preload';
import { UiScene } from '@/scenes/ui-scene';
import { LevelOneScene } from '@/scenes/level-one-scene';
import { VELOCITY, SCENE_SIZE } from '@/utils/constants';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#eeeeee',
  title: 'Phantom hollow',
  version: '0.8.0',
  scale: {
    parent: 'app',
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: VELOCITY.WORLD_VELOCITY_Y },
      debug: false,
    },
  },
  scene: [PreloadScene, UiScene, LevelOneScene],
};
