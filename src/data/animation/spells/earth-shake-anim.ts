import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function earthShakeAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.EARTH_SHAKE.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.EARTH_SHAKE.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.EARTH_SHAKE, { start: 0, end: 8 }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
