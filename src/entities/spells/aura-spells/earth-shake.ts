import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { AUDIO } from '@/constants/asset-keys';
import { playAnimation } from '@/utils/helpers';

export class EarthShake extends Spell {
  constructor({ scene, position, keyName, frame, caster, spellPower, damage }: SpellConfig) {
    super({
      scene,
      position,
      keyName,
      frame,
      caster,
      spellPower,
      damage,
    });

    this.audioKeys = {
      launch: undefined,
      impact: AUDIO.EARTH_SHAKE_IMPACT,
      critImpact: undefined,
      action: undefined,
    };

    this.animations = {
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.EARTH_SHAKE.MAIN,
    };
  }

  public cast(): void {
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.MAIN);
    playAnimation(this, animKey);
    this.playImpactSound();

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  public applyEffect(target: Character): void {}
}
