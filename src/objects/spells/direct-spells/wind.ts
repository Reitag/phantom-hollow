import { Spell, SpellConfig } from '@/objects/core/spell';
import { WIND_STATS } from '@/constants/object-stats';
import { Character } from '@/objects/core/character';

export class Wind extends Spell {
  private readonly force = 200;

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
    target.getMovement().applyForce(this.force);
  }
}
