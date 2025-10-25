import { PLAYER_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function playerAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(PLAYER_ANIMATION.IDLE)) {
    anims.create({
      key: PLAYER_ANIMATION.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.MOVE)) {
    anims.create({
      key: PLAYER_ANIMATION.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.CAST)) {
    anims.create({
      key: PLAYER_ANIMATION.CAST,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 21, end: 41 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.INSTANT_CAST)) {
    anims.create({
      key: PLAYER_ANIMATION.INSTANT_CAST,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 34, end: 37 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.DEATH)) {
    anims.create({
      key: PLAYER_ANIMATION.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 84, end: 101 }),
      frameRate: 14,
      repeat: 0,
    });
  }
}
