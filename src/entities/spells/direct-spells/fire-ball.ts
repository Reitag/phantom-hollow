import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { FIRE_BALL_STATS } from '@/constants/object-stats';

export class FireBall extends Spell {
  constructor({
    scene,
    position,
    keyName,
    frame,
    caster,
    spellPower,
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
      damage,
      speed,
      direction,
    });

    this.animations = {
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.FIRE_BALL.MAIN,
      [SPELL_ANIMATION_KEYS.HIT]: SPELLS_ANIMATION.FIRE_BALL.HIT,
    };

    this.arcadeBody.setSize(22, 13);
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
