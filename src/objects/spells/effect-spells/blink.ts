import { Spell, SpellConfig } from '@/objects/core/spell';

export class Blink extends Spell {
  constructor({ scene, position, keyName, frame, animation }: SpellConfig) {
    super({ scene, position, keyName, frame, animation });

    this.playAnimation(this.animation.main);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}
