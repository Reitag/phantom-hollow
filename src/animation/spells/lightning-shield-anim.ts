import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function lightningShieldAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.LIGHTNING_SHIELD.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.LIGHTNING_SHIELD.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.LIGHTNING_SHIELD, { start: 0, end: 4 }),
      frameRate: 14,
      repeat: -1,
    });
  }
}
