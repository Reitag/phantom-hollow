import { SHADOW_VULNERABILITY } from '@/constants/modifier-stats';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SHADOW_BOLT_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';

export class ShadowBolt extends Spell {
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
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.SHADOW_BOLT.MAIN,
      [SPELL_ANIMATION_KEYS.HIT]: SPELLS_ANIMATION.SHADOW_BOLT.HIT,
    };

    this.arcadeBody.setSize(22, 13);
  }

  public cast(): void {
    this.setSpellVelocity();
    this.playMainAnimation();

    this.scene.time.delayedCall(SHADOW_BOLT_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public applyEffect(target: Character): void {
    const debuff = target.getModifier();

    if (!debuff.isModifierExist(SHADOW_VULNERABILITY.id)) {
      debuff.addModifier(SHADOW_VULNERABILITY.id);
      debuff.startModifier(SHADOW_VULNERABILITY.id, target);
    }
  }
}
