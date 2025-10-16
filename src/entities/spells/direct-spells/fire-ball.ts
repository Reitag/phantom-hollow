import { Spell, SpellConfig } from '@/base/objects/spell';
import { FIRE_BALL_STATS } from '@/constants/object-stats';

export class FireBall extends Spell {
  constructor({
    scene,
    position,
    keyName,
    frame,
    caster,
    spellPower,
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
      caster,
      spellPower,
      animation,
      damage,
      speed,
      direction,
    });
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();

    this.scene.time.delayedCall(FIRE_BALL_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }
}
