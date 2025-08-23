import Phaser from 'phaser';

import { PreloadScene } from '@/scenes/preload';
import { UiScene } from '@/scenes/ui-scene';
import { LevelOneScene } from '@/scenes/level-one-scene';
import { WORLD_PARAMS } from '@/constants/physics';
import { SCENE_SIZE } from '@/constants/scene-size';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#eeeeee',
  title: 'Phantom hollow',
  version: '0.9.0',
  scale: {
    parent: 'app',
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: WORLD_PARAMS.GRAVITY },
      debug: false,
    },
  },
  scene: [PreloadScene, UiScene, LevelOneScene],
};
