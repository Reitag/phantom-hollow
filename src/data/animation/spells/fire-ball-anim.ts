import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function fireballAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.FIRE_BALL.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.FIRE_BALL.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.FIRE_BALL, { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.FIRE_BALL.DESTROY)) {
    anims.create({
      key: SPELLS_ANIMATION.FIRE_BALL.DESTROY,
      frames: anims.generateFrameNumbers(SPELLS.FIRE_BALL, { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }
}
