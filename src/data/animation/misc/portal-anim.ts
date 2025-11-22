import { PORTAL_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function portalAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(PORTAL_ANIMATION.SPIN)) {
    anims.create({
      key: PORTAL_ANIMATION.SPIN,
      frames: anims.generateFrameNumbers(MISC.PORTAL, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
