import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function zombieAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.MOVE)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 32, end: 34 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.DEATH)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
