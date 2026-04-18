import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function archerAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(ENEMIES_ANIMATION.ARCHER.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ARCHER.MOVE)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 10, end: 18 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ARCHER.RANGED_UPPER_ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.RANGED_UPPER_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 20, end: 29 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ARCHER.RANGED_STRAIGHT_ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.RANGED_STRAIGHT_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 30, end: 39 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ARCHER.RANGED_DOWN_ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.RANGED_DOWN_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 40, end: 49 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ARCHER.DEATH)) {
    anims.create({
      key: ENEMIES_ANIMATION.ARCHER.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.ARCHER, { start: 50, end: 57 }),
      frameRate: 8,
      repeat: 0,
    });
  }
}
