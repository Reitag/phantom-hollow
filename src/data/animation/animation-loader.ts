import { PLAYER, ENEMIES, PORTAL, SPELLS as SPELL_ANIM } from '@/constants/animation-keys';
import { CHARACTERS, MISC, SPELLS as SPELL_ASSET } from '@/constants/asset-keys';

export function registerGlobalAnimation(anims: Phaser.Animations.AnimationManager) {
  // player
  if (!anims.get(PLAYER.LEFT)) {
    anims.create({
      key: PLAYER.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER.RIGHT)) {
    anims.create({
      key: PLAYER.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER.IDLE)) {
    anims.create({
      key: PLAYER.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(PLAYER.SIMPLE_ATTACK)) {
    anims.create({
      key: PLAYER.SIMPLE_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 21, end: 41 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(PLAYER.DEATH)) {
    anims.create({
      key: PLAYER.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.PLAYER, { start: 84, end: 101 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  // fire-ball
  if (!anims.get(SPELL_ANIM.FIRE_BALL.MAIN)) {
    anims.create({
      key: SPELL_ANIM.FIRE_BALL.MAIN,
      frames: anims.generateFrameNumbers(SPELL_ASSET.FIRE_BALL, { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(SPELL_ANIM.FIRE_BALL.DESTROY)) {
    anims.create({
      key: SPELL_ANIM.FIRE_BALL.DESTROY,
      frames: anims.generateFrameNumbers(SPELL_ASSET.FIRE_BALL, { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // blink
  if (!anims.get(SPELL_ANIM.BLINK.MAIN)) {
    anims.create({
      key: SPELL_ANIM.BLINK.MAIN,
      frames: anims.generateFrameNumbers(SPELL_ASSET.BLINK, { start: 0, end: 9 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // skeleton-warrior
  if (!anims.get(ENEMIES.SKELETON_WARRIOR.LEFT)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.SKELETON_WARRIOR.RIGHT)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.SKELETON_WARRIOR.IDLE)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.SKELETON_WARRIOR.SIMPLE_ATTACK)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.SIMPLE_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 16, end: 19 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.SKELETON_WARRIOR.HURT)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.HURT,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(ENEMIES.SKELETON_WARRIOR.DEATH)) {
    anims.create({
      key: ENEMIES.SKELETON_WARRIOR.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.SKELETON_WARRIOR, { start: 32, end: 37 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // zombie
  if (!anims.get(ENEMIES.ZOMBIE.LEFT)) {
    anims.create({
      key: ENEMIES.ZOMBIE.LEFT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.ZOMBIE.RIGHT)) {
    anims.create({
      key: ENEMIES.ZOMBIE.RIGHT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.ZOMBIE.IDLE)) {
    anims.create({
      key: ENEMIES.ZOMBIE.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.ZOMBIE.SIMPLE_ATTACK)) {
    anims.create({
      key: ENEMIES.ZOMBIE.SIMPLE_ATTACK,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 32, end: 34 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(ENEMIES.ZOMBIE.HURT)) {
    anims.create({
      key: ENEMIES.ZOMBIE.HURT,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 16, end: 16 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(ENEMIES.ZOMBIE.DEATH)) {
    anims.create({
      key: ENEMIES.ZOMBIE.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.ZOMBIE, { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // portal
  if (!anims.get(PORTAL.SPIN)) {
    anims.create({
      key: PORTAL.SPIN,
      frames: anims.generateFrameNumbers(MISC.PORTAL, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
