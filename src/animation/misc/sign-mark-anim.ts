import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function signMarkAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.SIGN_MARK.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.SIGN_MARK.MAIN,
      frames: anims.generateFrameNumbers(MISC.SIGN_MARK, { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
  }
}
