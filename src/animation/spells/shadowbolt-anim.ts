import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function shadowboltAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.SHADOW_BOLT.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.SHADOW_BOLT.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.SHADOW_BOLT, { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.SHADOW_BOLT.HIT)) {
    anims.create({
      key: SPELLS_ANIMATION.SHADOW_BOLT.HIT,
      frames: anims.generateFrameNumbers(SPELLS.SHADOW_BOLT, { start: 4, end: 10 }),
      frameRate: 20,
      repeat: 0,
    });
  }
}
