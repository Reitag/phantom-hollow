import { PLAYER_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function playerAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(PLAYER_ANIMATION.IDLE)) {
    anims.create({
      key: PLAYER_ANIMATION.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 0, end: 6 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.MOVE)) {
    anims.create({
      key: PLAYER_ANIMATION.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 15, end: 20 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.JUMP)) {
    anims.create({
      key: PLAYER_ANIMATION.JUMP,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 31, end: 33 }),
      frameRate: 16,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.FALL)) {
    anims.create({
      key: PLAYER_ANIMATION.FALL,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 34, end: 35 }),
      frameRate: 2,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.CAST_START)) {
    anims.create({
      key: PLAYER_ANIMATION.CAST_START,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 45, end: 51 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.CAST_MAIN)) {
    anims.create({
      key: PLAYER_ANIMATION.CAST_MAIN,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 52, end: 56 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.CAST_END)) {
    anims.create({
      key: PLAYER_ANIMATION.CAST_END,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 57, end: 59 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.INSTANT_CAST)) {
    anims.create({
      key: PLAYER_ANIMATION.INSTANT_CAST,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 57, end: 59 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.DEATH)) {
    anims.create({
      key: PLAYER_ANIMATION.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 60, end: 69 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
