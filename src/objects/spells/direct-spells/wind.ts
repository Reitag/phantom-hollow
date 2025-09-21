import { Spell, SpellConfig } from '@/objects/core/spell';
import { WIND_STATS } from '@/constants/object-stats';
import { Character } from '@/objects/core/character';

export class Wind extends Spell {
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

    this.scene.time.delayedCall(WIND_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public override applyEffect(target: Character): void {
    if (!target) return;
    console.log(target.x, this.x);
    target.getMovement().applyForce(WIND_STATS.FORCE);
  }
}
