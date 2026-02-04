import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function windWaveAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.WIND_WAVE.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.WIND_WAVE.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.WIND_WAVE, { start: 0, end: 6 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
