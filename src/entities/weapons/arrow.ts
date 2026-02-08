import { Character } from '@/base/objects/character';
import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { ARROW_STATS } from '@/constants/object-stats';
import { SpriteConfig } from '@/utils/types';

export class Arrow extends ArcadeSprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });

    this.setSize(10, 10);

    scene.time.delayedCall(ARROW_STATS.LIFE_TIME, () => {
      if (this.active) this.destroy();
    });
  }

  public launch(target: Character): void {
    const dx = target.x - this.x;
    const dy = target.y - this.y;

    const speed = ARROW_STATS.SPEED;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      this.setVelocityX((dx / distance) * speed);
      this.setVelocityY((dy / distance) * speed);
    }
    this.rotation = Math.atan2(dy, dx);
  }
}
