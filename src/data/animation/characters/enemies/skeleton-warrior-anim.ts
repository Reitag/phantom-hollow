import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function skeletonwarriorAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.MOVE)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 16, end: 19 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 32, end: 37 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
