import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function bonFireAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.BON_FIRE.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.BON_FIRE.MAIN,
      frames: anims.generateFrameNumbers(MISC.BON_FIRE, { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1,
    });
  }
}
