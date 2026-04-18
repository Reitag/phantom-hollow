import { DARK_ENERGY_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function darkEnergyAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(DARK_ENERGY_ANIMATION.IDLE)) {
    anims.create({
      key: DARK_ENERGY_ANIMATION.IDLE,
      frames: anims.generateFrameNumbers(MISC.DARK_ENERGY, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
