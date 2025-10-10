import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { Z_POSITION } from '@/constants/z-position';
import { playAnimation } from '@/utils/helpers';
import { ArcadeSpriteConfig, ItemAnimationConfig } from '@/utils/types';

export interface ItemConfig extends ArcadeSpriteConfig {
  animation?: ItemAnimationConfig;
}

export abstract class Item extends ArcadeSprite {
  protected animation: ItemAnimationConfig | null = null;

  constructor({ scene, position, keyName, frame, animation }: ItemConfig) {
    super({ scene, position, keyName, frame });

    this.animation = animation || null;

    this.setDepth(Z_POSITION.ITEM);

    playAnimation(this, this.animation?.idle);
  }
}
