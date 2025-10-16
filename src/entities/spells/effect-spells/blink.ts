import { Spell, SpellConfig } from '@/base/objects/spell';
import { BLINK_STATS } from '@/constants/object-stats';
import { CollisionService } from '@/infrastructure/collision-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { playAnimation } from '@/utils/helpers';

export class Blink extends Spell {
  private collisions: CollisionService;

  constructor({ scene, position, keyName, frame, caster, animation, direction }: SpellConfig) {
    super({ scene, position, keyName, frame, caster, animation, direction });
    this.collisions = ServiceLocator.resolve(ServiceKeys.collision);
  }

  public cast(): void {
    if (this.direction) {
      playAnimation(this, this.animation?.main);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });

      this.hideCaster();

      this.scene.time.delayedCall(BLINK_STATS.DELAY, () => {
        this.teleportTo(BLINK_STATS.DISTANCE, this.direction as number);
        this.showCaster();
      });
    }
  }

  private hideCaster(): void {
    const arcadeBody = this.caster.getArcadeBody();
    arcadeBody.enable = false;
    this.caster.setVisible(false);
  }

  private showCaster(): void {
    const arcadeBody = this.caster.getArcadeBody();
    arcadeBody.enable = true;
    this.caster.setVisible(true);
  }

  private teleportTo(distance: number, direction: number): void {
    const step = 5;

    let targetX = this.caster.x + distance * direction;
    let backoff = 0;

    while (targetX !== this.caster.x) {
      if (this.collisions.isCollidingWithTile(targetX, this.caster.y)) {
        backoff += step;
        targetX = this.caster.x + (distance - backoff) * direction;
      } else {
        this.caster.x = targetX;
        return;
      }
    }
  }
}
