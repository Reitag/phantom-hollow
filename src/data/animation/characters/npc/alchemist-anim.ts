import { NPC_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function alchemistAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(NPC_ANIMATION.ALCHEMIST.IDLE)) {
    anims.create({
      key: NPC_ANIMATION.ALCHEMIST.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.ALCHEMIST, { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });
  }
}
