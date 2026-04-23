import { Sprite } from '@/base/objects/sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { SpriteConfig } from '@/utils/types';

export class Bowler extends Sprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(0, 0);

    this.anims.play(MISC_ANIMATION.BOWLER.MAIN);
  }
}
