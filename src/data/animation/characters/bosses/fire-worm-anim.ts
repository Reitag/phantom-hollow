import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function fireWormAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.IDLE)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 0, end: 8 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.MOVE)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 16, end: 24 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.CAST_START)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.CAST_START,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 32, end: 36 }),
      frameRate: 20,
      repeat: 0,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.CAST_MAIN)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.CAST_MAIN,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 37, end: 41 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.CAST_END)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.CAST_END,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 42, end: 47 }),
      frameRate: 20,
      repeat: 0,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.FIRE_WORM.DEATH)) {
    anims.create({
      key: BOSSES_ANIMATION.FIRE_WORM.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.FIRE_WORM, { start: 48, end: 55 }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
