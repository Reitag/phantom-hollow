import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function bowlerAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.BOWLER.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.BOWLER.MAIN,
      frames: anims.generateFrameNumbers(MISC.BOWLER, { start: 0, end: 39 }),
      frameRate: 14,
      repeat: -1,
    });
  }
}
