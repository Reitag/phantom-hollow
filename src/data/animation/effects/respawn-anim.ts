import { EFFECTS_ANIMATION } from '@/constants/animation-keys';
import { EFFECTS } from '@/constants/asset-keys';

export function respawnAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(EFFECTS_ANIMATION.RESPAWN.MAIN)) {
    anims.create({
      key: EFFECTS_ANIMATION.RESPAWN.MAIN,
      frames: anims.generateFrameNumbers(EFFECTS.RESPAWN, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 0,
    });
  }
}
