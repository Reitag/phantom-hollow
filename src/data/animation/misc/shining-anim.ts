import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function shiningAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.SHINING.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.SHINING.MAIN,
      frames: anims.generateFrameNumbers(MISC.SHINING, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
