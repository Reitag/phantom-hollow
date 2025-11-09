import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { Z_POSITION } from '@/constants/z-position';
import { ArcadeSpriteConfig } from '@/utils/types';

export class SoulFire extends ArcadeSprite {
  constructor({ scene, position, keyName, frame }: ArcadeSpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(0.5, 1);
    this.getArcadeBody().allowGravity = false;
    this.setDepth(Z_POSITION.MISC);

    this.playStartAnimation();
  }

  private playStartAnimation(): void {
    const startKey = MISC_ANIMATION.SOUL_FIRE.START;
    const mainKey = MISC_ANIMATION.SOUL_FIRE.MAIN;

    this.once(`animationcomplete-${startKey}`, () => {
      this.anims.play(mainKey, true);
    });

    this.anims.play(startKey);
  }
}
