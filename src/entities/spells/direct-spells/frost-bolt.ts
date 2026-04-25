import { Spell, SpellConfig } from '@/base/objects/spell';
import { AUDIO } from '@/constants/asset-keys';
import { FROST_BOLT_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { SHARED_STATES } from '@/constants/state-keys';
import { FROSTBITE } from '@/constants/modifier-stats';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Player } from '@/entities/characters/player/player';
import { FrostBite } from '@/game/modifiers/debuffs/frostbite';

export class FrostBolt extends Spell {
  private hasRelic = false;

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
      critImpact: undefined,
      action: undefined,
    };

    this.relicId = 'frost-relic';

    this.arcadeBody.setSize(22, 13);
    this.checkRelic();
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

    const debuff = target.getModifier();

    // Does not have the relic
    if (!this.hasRelic) {
      if (!debuff.isModifierExist(FROSTBITE.id)) {
        debuff.addModifier(FROSTBITE.id);
        debuff.startModifier(FROSTBITE.id, target);
      }

      return;
    }

    const fsm = target.getStateMachine();

    if (fsm.currentStateName !== SHARED_STATES.FREEZE) {
      fsm.changeState(SHARED_STATES.FREEZE);

      if (fsm.currentStateName !== SHARED_STATES.FREEZE) {
        const ui = ServiceLocator.resolve(ServiceKeys.ui);
        if (target.active) ui.showDamageDealt('Resist', target);

        if (!debuff.isModifierExist(FROSTBITE.id)) {
          debuff.addModifier(FROSTBITE.id);

          const instance = debuff.getModifier(FROSTBITE.id);
          (instance as FrostBite).relic = true;

          debuff.startModifier(FROSTBITE.id, target);
        }
      }
    }
  }

  private checkRelic(): void {
    if (!(this.caster instanceof Player)) return;
    const activeRelic = this.sandbox.findSomeRelic();

    if (activeRelic && activeRelic === this.relicId) {
      this.hasRelic = true;
    }
  }
}
