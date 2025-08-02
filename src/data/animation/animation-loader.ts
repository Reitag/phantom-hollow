import { AnimationKeys } from '@/utils/animation-keys';

export function registerGlobalAnimation(anims: Phaser.Animations.AnimationManager) {
  // player
  if (!anims.get(AnimationKeys.Player.Left)) {
    anims.create({
      key: AnimationKeys.Player.Left,
      frames: anims.generateFrameNumbers('player', { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Player.Right)) {
    anims.create({
      key: AnimationKeys.Player.Right,
      frames: anims.generateFrameNumbers('player', { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Player.Idle)) {
    anims.create({
      key: AnimationKeys.Player.Idle,
      frames: anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Player.SimpleAttack)) {
    anims.create({
      key: AnimationKeys.Player.SimpleAttack,
      frames: anims.generateFrameNumbers('player', { start: 21, end: 41 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(AnimationKeys.Player.Death)) {
    anims.create({
      key: AnimationKeys.Player.Death,
      frames: anims.generateFrameNumbers('player', { start: 84, end: 101 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  // fire-ball
  if (!anims.get(AnimationKeys.Spells.Fireball.Loop)) {
    anims.create({
      key: AnimationKeys.Spells.Fireball.Loop,
      frames: anims.generateFrameNumbers('fire-ball', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Spells.Fireball.Destroy)) {
    anims.create({
      key: AnimationKeys.Spells.Fireball.Destroy,
      frames: anims.generateFrameNumbers('fire-ball', { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // blink
  if (!anims.get(AnimationKeys.Spells.Blink.BlinkAnim)) {
    anims.create({
      key: AnimationKeys.Spells.Blink.BlinkAnim,
      frames: anims.generateFrameNumbers('blink', { start: 0, end: 9 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // skeleton-warrior
  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.Left)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.Left,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.Right)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.Right,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.Idle)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.Idle,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.SimpleAttack)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.SimpleAttack,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 16, end: 19 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.Hurt)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.Hurt,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get(AnimationKeys.Enemies.Melee.SkeletonWarrior.Death)) {
    anims.create({
      key: AnimationKeys.Enemies.Melee.SkeletonWarrior.Death,
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 32, end: 37 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // portal
  if (!anims.get(AnimationKeys.Portal.Spin)) {
    anims.create({
      key: AnimationKeys.Portal.Spin,
      frames: anims.generateFrameNumbers('portal', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
