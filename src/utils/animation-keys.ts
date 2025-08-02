export const AnimationKeys = {
  Player: {
    Left: 'left',
    Right: 'right',
    Idle: 'idle',
    SimpleAttack: 'simple-attack',
    Death: 'death',
  },
  Spells: {
    Fireball: {
      Loop: 'fire-ball-anim',
      Destroy: 'fire-ball-anim-destroy',
    },
    Blink: {
      BlinkAnim: 'blink-anim',
    },
  },
  Enemies: {
    Melee: {
      SkeletonWarrior: {
        Left: 'sk-warrior-left',
        Right: 'sk-warrior-right',
        Idle: 'sk-warrior-idle',
        SimpleAttack: 'sk-warrior-simple-attack',
        Hurt: 'sk-warrior-hurt',
        Death: 'sk-warrior-death',
      },
    },
  },
  Portal: {
    Spin: 'portal-spin',
  },
} as const;
