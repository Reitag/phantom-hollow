import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function soulFireAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.SOUL_FIRE.START)) {
    anims.create({
      key: MISC_ANIMATION.SOUL_FIRE.START,
      frames: anims.generateFrameNumbers(MISC.SOUL_FIRE, { start: 0, end: 3 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(MISC_ANIMATION.SOUL_FIRE.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.SOUL_FIRE.MAIN,
      frames: anims.generateFrameNumbers(MISC.SOUL_FIRE, { start: 4, end: 11 }),
      frameRate: 14,
      repeat: -1,
    });
  }
}
