import { Spell, SpellConfig } from '@/objects/core/spell';

export class FireBall extends Spell {
  constructor({
    scene,
    position,
    keyName,
    frame,
    sandbox,
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
      sandbox,
      animation,
      damage,
      speed,
      direction,
    });
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();

    this.scene.time.delayedCall(1100, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }
}
