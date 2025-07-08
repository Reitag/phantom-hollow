export function registerGlobalAnimation(anims: Phaser.Animations.AnimationManager) {
  // player
  if (!anims.get('left')) {
    anims.create({
      key: 'left',
      frames: anims.generateFrameNumbers('player', { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get('right')) {
    anims.create({
      key: 'right',
      frames: anims.generateFrameNumbers('player', { start: 42, end: 47 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get('idle')) {
    anims.create({
      key: 'idle',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get('simple-attack')) {
    anims.create({
      key: 'simple-attack',
      frames: anims.generateFrameNumbers('player', { start: 21, end: 41 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get('death')) {
    anims.create({
      key: 'death',
      frames: anims.generateFrameNumbers('player', { start: 84, end: 101 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  // fire-ball
  if (!anims.get('fire-ball-anim')) {
    anims.create({
      key: 'fire-ball-anim',
      frames: anims.generateFrameNumbers('fire-ball', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  if (!anims.get('fire-ball-anim-destroy')) {
    anims.create({
      key: 'fire-ball-anim-destroy',
      frames: anims.generateFrameNumbers('fire-ball', { start: 4, end: 9 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // blink
  if (!anims.get('blink-anim')) {
    anims.create({
      key: 'blink-anim',
      frames: anims.generateFrameNumbers('blink', { start: 0, end: 9 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // skeleton-warrior
  if (!anims.get('sk-warrior-left')) {
    anims.create({
      key: 'sk-warrior-left',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get('sk-warrior-right')) {
    anims.create({
      key: 'sk-warrior-right',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.get('sk-warrior-idle')) {
    anims.create({
      key: 'sk-warrior-idle',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 6,
    });
  }

  if (!anims.get('sk-warrior-simple-attack')) {
    anims.create({
      key: 'sk-warrior-simple-attack',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 16, end: 19 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get('sk-warrior-hurt')) {
    anims.create({
      key: 'sk-warrior-hurt',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 24, end: 25 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  if (!anims.get('sk-warrior-death')) {
    anims.create({
      key: 'sk-warrior-death',
      frames: anims.generateFrameNumbers('skeleton-warrior', { start: 32, end: 37 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // portal
  if (!anims.get('portal-spin')) {
    anims.create({
      key: 'portal-spin',
      frames: anims.generateFrameNumbers('portal', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
