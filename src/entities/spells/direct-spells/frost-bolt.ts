import { Spell, SpellConfig } from '@/base/objects/spell';
import { FROST_BOLT_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SHARED_STATES } from '@/constants/state-keys';

export class FrostBolt extends Spell {
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
      [SPELL_ANIMATION_KEYS.START]: SPELLS_ANIMATION.FROST_BOLT.START,
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.FROST_BOLT.MAIN,
      [SPELL_ANIMATION_KEYS.HIT]: SPELLS_ANIMATION.FROST_BOLT.HIT,
    };

    this.arcadeBody.setSize(22, 13);
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();

    this.scene.time.delayedCall(FROST_BOLT_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public applyEffect(target: Character): void {
    const fsm = target.getStateMachine();

    if (fsm.currentStateName !== SHARED_STATES.FREEZE) {
      fsm.changeState(SHARED_STATES.FREEZE);
    }
  }
}
