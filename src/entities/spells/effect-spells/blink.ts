import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { BLINK_STATS } from '@/constants/object-stats';
import { CollisionService } from '@/infrastructure/collision-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { playAnimation } from '@/utils/helpers';

export class Blink extends Spell {
  private character: Character;
  private collisions: CollisionService;

  constructor({
    scene,
    position,
    keyName,
    frame,
    character,
    animation,
    direction,
  }: SpellConfig & { character: Character }) {
    super({ scene, position, keyName, frame, animation, direction });
    this.character = character;
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
    const arcadeBody = this.character.getArcadeBody();
    arcadeBody.enable = false;
    this.character.setVisible(false);
  }

  private showCaster(): void {
    const arcadeBody = this.character.getArcadeBody();
    arcadeBody.enable = true;
    this.character.setVisible(true);
  }

  private teleportTo(distance: number, direction: number): void {
    const step = 5;

    let targetX = this.character.x + distance * direction;
    let backoff = 0;

    while (targetX !== this.character.x) {
      if (this.collisions.isCollidingWithTile(targetX, this.character.y)) {
        backoff += step;
        targetX = this.character.x + (distance - backoff) * direction;
      } else {
        this.character.x = targetX;
        return;
      }
    }
  }
}
