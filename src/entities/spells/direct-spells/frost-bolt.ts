import { Spell, SpellConfig } from '@/base/objects/spell';
import { AUDIO, VFX } from '@/constants/asset-keys';
import { FROST_BOLT_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION, VFX_ANIMATION } from '@/constants/animation-keys';
import { SHARED_STATES } from '@/constants/state-keys';
import { ARCANE_MIND } from '@/constants/modifier-stats';
import { AttachedVfx } from '@/entities/misc/attached-vfx';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

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

    this.audioKeys = {
      launch: AUDIO.FROSTBOLT_LAUNCH,
      impact: AUDIO.FROSTBOLT_IMPACT,
      action: undefined,
    };

    this.arcadeBody.setSize(22, 13);
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();
    this.playLaunchSound();

    this.scene.time.delayedCall(FROST_BOLT_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public applyEffect(target: Character): void {
    if (target.getDead()) return;

    const fsm = target.getStateMachine();

    if (fsm.currentStateName !== SHARED_STATES.FREEZE) {
      fsm.changeState(SHARED_STATES.FREEZE);

      if (fsm.currentStateName !== SHARED_STATES.FREEZE) {
        const ui = ServiceLocator.resolve(ServiceKeys.ui);
        if (target.active) ui.showDamageDealt('Resist', target);

        const casterModifier = this.caster.getModifier();
        if (!casterModifier.isModifierExist(ARCANE_MIND.id)) {
          casterModifier.addModifier(ARCANE_MIND.id);
          casterModifier.startModifier(ARCANE_MIND.id, this.caster);

          new AttachedVfx({
            scene: this.scene,
            caster: this.caster,
            keyName: VFX.ARCANE_MIND_VFX,
            animKey: VFX_ANIMATION.ARCANE_MIND.MAIN,
          });
        }
      }
    }
  }
}
