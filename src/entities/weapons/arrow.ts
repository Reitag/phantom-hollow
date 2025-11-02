import { Character } from '@/base/objects/character';
import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { ArcadeSpriteConfig } from '@/utils/types';

export class Arrow extends ArcadeSprite {
  constructor({ scene, position, keyName, frame }: ArcadeSpriteConfig) {
    super({ scene, position, keyName, frame });

    this.setSize(10, 10);

    scene.time.delayedCall(3000, () => {
      if (this.active) this.destroy();
    });
  }

  public launch(target: Character): void {
    const dx = target.x - this.x;
    const dy = target.y - this.y;

    const speed = 400;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      this.setVelocityX((dx / distance) * speed);
      this.setVelocityY((dy / distance) * speed);
    }
    this.rotation = Math.atan2(dy, dx);
  }
}
