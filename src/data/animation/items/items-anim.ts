import { ITEMS_ANIMATION } from '@/constants/animation-keys';
import { ITEMS } from '@/constants/asset-keys';

export function itemsAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(ITEMS_ANIMATION.COIN.IDLE)) {
    anims.create({
      key: ITEMS_ANIMATION.COIN.IDLE,
      frames: anims.generateFrameNumbers(ITEMS.COIN, { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
