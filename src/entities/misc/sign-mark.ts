import { Sprite } from '@/base/objects/sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { Z_POSITION } from '@/constants/z-position';
import { SpriteConfig } from '@/utils/types';

export class SignMark extends Sprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(0, 0);
    this.setDepth(Z_POSITION.MISC);
    this.anims.play(MISC_ANIMATION.SIGN_MARK.MAIN);
  }
}
