import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function blinkAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.BLINK.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.BLINK.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.BLINK, { start: 0, end: 9 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }
}
