import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function mutadedbatAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(ENEMIES_ANIMATION.MUTADED_BAT.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.MUTADED_BAT.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.MUTATED_BAT, { start: 0, end: 5 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.MUTADED_BAT.DEATH)) {
    anims.create({
      key: ENEMIES_ANIMATION.MUTADED_BAT.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.MUTATED_BAT, { start: 8, end: 15 }),
      frameRate: 20,
      repeat: 0,
    });
  }
}
