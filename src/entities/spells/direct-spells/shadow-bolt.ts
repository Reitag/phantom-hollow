import { SHADOW_VULNERABILITY } from '@/constants/modifier-stats';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SHADOW_BOLT_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';

export class ShadowBolt extends Spell {
  constructor({
    scene,
    position,
    keyName,
    frame,
    caster,
    spellPower,
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
      caster,
      spellPower,
      animation,
      damage,
      speed,
      direction,
    });
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

  public override applyEffect(target: Character): void {
    const debuff = target.getModifier();

    if (!debuff.isModifierExist(SHADOW_VULNERABILITY.id)) {
      debuff.addModifier(SHADOW_VULNERABILITY.id);
      debuff.startModifier(SHADOW_VULNERABILITY.id, target);
    }
  }
}
