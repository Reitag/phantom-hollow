import { Spell, SpellConfig } from '@/base/objects/spell';
import { WIND_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';

export class Wind extends Spell {
  constructor({ scene, position, keyName, frame, caster, damage, speed, direction }: SpellConfig) {
    super({
      scene,
      position,
      keyName,
      frame,
      caster,
      damage,
      speed,
      direction,
    });

    this.animations = {
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.WIND.MAIN,
      [SPELL_ANIMATION_KEYS.HIT]: SPELLS_ANIMATION.WIND.HIT,
    };

    this.arcadeBody.setSize(22, 13);
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
