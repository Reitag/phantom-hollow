import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function bonFireAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.BONFIRE.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.BONFIRE.MAIN,
      frames: anims.generateFrameNumbers(MISC.BONFIRE, { start: 0, end: 39 }),
      frameRate: 14,
      repeat: -1,
    });
  }
}
