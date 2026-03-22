import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SPELLS } from '@/constants/asset-keys';

export function frostboltAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(SPELLS_ANIMATION.FROST_BOLT.START)) {
    anims.create({
      key: SPELLS_ANIMATION.FROST_BOLT.START,
      frames: anims.generateFrameNumbers(SPELLS.FROST_BOLT, { start: 0, end: 2 }),
      frameRate: 20,
      repeat: 0,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.FROST_BOLT.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.FROST_BOLT.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.FROST_BOLT, { start: 3, end: 12 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.FROST_BOLT.HIT)) {
    anims.create({
      key: SPELLS_ANIMATION.FROST_BOLT.HIT,
      frames: anims.generateFrameNumbers(SPELLS.FROST_BOLT, { start: 13, end: 20 }),
      frameRate: 20,
      repeat: 0,
    });
  }
}
