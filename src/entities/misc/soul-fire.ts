import { Sprite } from '@/base/objects/sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { SpriteConfig } from '@/utils/types';

export class SoulFire extends Sprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(0.5, 1);

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
