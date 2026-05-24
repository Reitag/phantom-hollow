import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SpellPower } from '@/components/stats/damage';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { AUDIO } from '@/constants/asset-keys';
import { FIRE_ENERGY } from '@/constants/modifier-stats';
import { FIRE_BALL_STATS } from '@/constants/object-stats';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { ModifierSystem } from '@/systems/modifier-system';
import { UiSystem } from '@/systems/ui-system';

export class FireBall extends Spell {
  private modifier: ModifierSystem;
  private ui: UiSystem;

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

    this.audioKeys = {
      launch: AUDIO.FIREBALL_LAUNCH,
      impact: AUDIO.FIREBALL_IMPACT,
      critImpact: AUDIO.FIREBALL_CRIT_IMPACT,
      action: undefined,
    };

    this.modifier = this.caster.getModifier();
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);

    this.relicId = 'fire-relic';

    this.arcadeBody.setSize(22, 13);
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();
    this.playLaunchSound();

    this.scene.time.delayedCall(FIRE_BALL_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public applyEffect(target: Character): void {}

  protected override onDestroyStart(): void {
    if (!(this.caster instanceof Player)) return;
    if (this.hittedEnemies.includes(this.caster)) return;
    if (!this.isEnemyHitAtLeastOnce()) return;
    if (this.hittedEnemies.length > 0 && this.modifier.isModifierExist(FIRE_ENERGY.id)) {
      this.modifier.removeModifier(FIRE_ENERGY.id);
      this.ui.removeModifierIcon(FIRE_ENERGY.id);

      const spellPower = this.caster.getStats().damage.spellPower as SpellPower;
      spellPower.allowCriticalStrike = false;
      spellPower.allowInstantCast = false;

      this.sandbox.resetFireStacks();

      return;
    }

    const activeRelic = this.sandbox.findSomeRelic();
    if (activeRelic && activeRelic === this.relicId) {
      this.sandbox.trackFireRelicHit();
    }
  }
}
