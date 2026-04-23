import { Sprite } from '@/base/objects/sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { SpriteConfig } from '@/utils/types';

export class Campfire extends Sprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(-1, -1);

    this.anims.play(MISC_ANIMATION.BONFIRE.MAIN);
  }
}
