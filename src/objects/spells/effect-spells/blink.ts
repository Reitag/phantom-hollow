import { Spell, SpellConfig } from '@/objects/core/spell';
import { playAnimation } from '@/utils/helpers';

export class Blink extends Spell {
  constructor({ scene, position, keyName, frame, sandbox, animation, direction }: SpellConfig) {
    super({ scene, position, keyName, frame, sandbox, animation, direction });
  }

  public cast(): void {
    playAnimation(this, this.animation.main);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });

    const distance = 300;
    const blinkDelay = 500;

    if (this.direction) {
      this.sandbox.hidePlayer();

      this.scene.time.delayedCall(blinkDelay, () => {
        this.sandbox.teleportPlayer(distance, this.direction as number);
        this.sandbox.showPlayer();
      });
    }
  }
}
