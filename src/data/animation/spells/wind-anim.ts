import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function windAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.WIND.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.WIND.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.WIND, { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.WIND.HIT)) {
    anims.create({
      key: SPELLS_ANIMATION.WIND.HIT,
      frames: anims.generateFrameNumbers(SPELLS.WIND, { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }
}
