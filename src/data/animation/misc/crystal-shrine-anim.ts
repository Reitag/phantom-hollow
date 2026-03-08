import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function crystalShrineAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.CRYSTAL_SHRINE.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.CRYSTAL_SHRINE.MAIN,
      frames: anims.generateFrameNumbers(MISC.CRYSTAL_SHRINE, { start: 0, end: 4 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
