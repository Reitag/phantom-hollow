import { PreloadScene } from '../scenes/preload.js';
import { UiScene } from '../scenes/ui-scene.js';
import { LevelOneScene } from '../scenes/level-one.js';
import { VELOCITY, SCENE_SIZE } from './constants.js';

export default {
  type: Phaser.AUTO,
  backgroundColor: '#eeeeee',
  scale: {
    parent: "app",
    width: SCENE_SIZE.WIDTH,
    height: SCENE_SIZE.HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: VELOCITY.WORLD_VELOCITY_Y },
      debug: false,
    }
  },
  scene: [PreloadScene, UiScene, LevelOneScene],
  pixelArt: true,
  roundPixels: true
};
