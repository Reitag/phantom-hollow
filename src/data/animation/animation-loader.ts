import {
  PLAYER_ANIMATION,
  SPELLS_ANIMATION,
  ENEMIES_ANIMATION,
  PORTAL_ANIMATION,
} from '@/constants/animation-keys';
import { CHARACTERS, MISC, SPELLS } from '@/constants/asset-keys';

export function registerGlobalAnimation(anims: Phaser.Animations.AnimationManager) {
  // player
  if (!anims.get(PLAYER_ANIMATION.LEFT)) {
    anims.create({
      key: PLAYER_ANIMATION.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.RIGHT)) {
    anims.create({
      key: PLAYER_ANIMATION.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.IDLE)) {
    anims.create({
      key: PLAYER_ANIMATION.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER_ANIMATION.SIMPLE_ATTACK)) {
    anims.create({
      key: PLAYER_ANIMATION.SIMPLE_ATTACK,
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

  // fire-ball
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

  // blink
  if (!anims.get(SPELLS_ANIMATION.BLINK.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.BLINK.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.BLINK, { start: 0, end: 9 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // wind
  if (!anims.get(SPELLS_ANIMATION.WIND.MAIN)) {
    anims.create({
      key: SPELLS_ANIMATION.WIND.MAIN,
      frames: anims.generateFrameNumbers(SPELLS.WIND, { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELLS_ANIMATION.WIND.DESTROY)) {
    anims.create({
      key: SPELLS_ANIMATION.WIND.DESTROY,
      frames: anims.generateFrameNumbers(SPELLS.WIND, { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // skeleton-warrior
  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.LEFT)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.RIGHT)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.SIMPLE_ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.SIMPLE_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 16, end: 19 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.HURT)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.HURT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH)) {
    anims.create({
      key: ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 32, end: 37 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // zombie
  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.LEFT)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.RIGHT)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.IDLE)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.SIMPLE_ATTACK)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.SIMPLE_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 32, end: 34 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES_ANIMATION.ZOMBIE.HURT)) {
    anims.create({
      key: ENEMIES_ANIMATION.ZOMBIE.HURT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 16, end: 16 }),
      frameRate: 10,
      repeat: 0,
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

  // portal
  if (!anims.get(PORTAL_ANIMATION.SPIN)) {
    anims.create({
      key: PORTAL_ANIMATION.SPIN,
      frames: anims.generateFrameNumbers(MISC.PORTAL, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
