import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function shadowTrailAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.SHADOW_TRAIL.START)) {
    anims.create({
      key: SPELLS_ANIMATION.SHADOW_TRAIL.START,
      frames: anims.generateFrameNumbers(SPELLS.SHADOW_TRAIL, { start: 0, end: 4 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.SHADOW_TRAIL.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.SHADOW_TRAIL.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.SHADOW_TRAIL, { start: 5, end: 8 }),
      frameRate: 14,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.SHADOW_TRAIL.HIT)) {
    anims.create({
      key: SPELLS_ANIMATION.SHADOW_TRAIL.HIT,
      frames: anims.generateFrameNumbers(SPELLS.SHADOW_TRAIL, { start: 9, end: 13 }),
      frameRate: 14,
      repeat: 0,
    });
  }
}
