import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
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

    this.animations = {
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.EARTH_SHAKE.MAIN,
    };
  }

  public cast(): void {
    const animKey = this.resolveAnimation(SPELL_ANIMATION_KEYS.MAIN);
    playAnimation(this, animKey);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  public applyEffect(target: Character): void {}
}
