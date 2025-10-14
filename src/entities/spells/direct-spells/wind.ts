import { Spell, SpellConfig } from '@/base/objects/spell';
import { WIND_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';

export class Wind extends Spell {
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
    target.getStats().speed?.applyForce(WIND_STATS.FORCE);
  }
}
