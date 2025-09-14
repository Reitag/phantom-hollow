import { BLINK_STATS } from '@/constants/object-stats';
import { Spell, SpellConfig } from '@/objects/core/spell';
import { playAnimation } from '@/utils/helpers';

export class Blink extends Spell {
  constructor({ scene, position, keyName, frame, sandbox, animation, direction }: SpellConfig) {
    super({ scene, position, keyName, frame, sandbox, animation, direction });
  }

  public cast(): void {
    if (this.direction) {
      playAnimation(this, this.animation?.main);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });

      this.sandbox?.hidePlayer();

      this.scene.time.delayedCall(BLINK_STATS.DELAY, () => {
        this.sandbox?.teleportPlayer(BLINK_STATS.DISTANCE, this.direction as number);
        this.sandbox?.showPlayer();
      });
    }
  }
}
