import { Spell, SpellConfig } from '@/objects/core/spell';

export class FireBall extends Spell {
  constructor({
    scene,
    position,
    keyName,
    frame,
    animation,
    damage,
    speed,
    direction,
  }: SpellConfig) {
    super({
      scene,
      position,
      keyName,
      frame,
      animation,
      damage,
      speed,
      direction,
    });

    this.setSpellVelocity();
    this.playMainAnimation();

    scene.time.delayedCall(1100, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }
}
