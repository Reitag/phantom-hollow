import { EFFECTS_ANIMATION } from '@/constants/animation-keys';
import { EFFECTS } from '@/constants/asset-keys';

export function freezeAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(EFFECTS_ANIMATION.FREEZE.MAIN)) {
    anims.create({
      key: EFFECTS_ANIMATION.FREEZE.MAIN,
      frames: anims.generateFrameNumbers(EFFECTS.FREEZE, { start: 0, end: 7 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(EFFECTS_ANIMATION.FREEZE.END)) {
    anims.create({
      key: EFFECTS_ANIMATION.FREEZE.END,
      frames: anims.generateFrameNumbers(EFFECTS.FREEZE, { start: 7, end: 15 }),
      frameRate: 14,
      repeat: 0,
    });
  }
}
