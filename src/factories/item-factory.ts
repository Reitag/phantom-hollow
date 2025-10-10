import { ITEMS } from '@/constants/asset-keys';
import { ITEMS_ANIMATION } from '@/constants/animation-keys';
import { Coin } from '@/entities/items/coin';
import { Position } from '@/utils/types';

export class ItemFactory {
  constructor(private scene: Phaser.Scene) {}

  public createCoinGroup(positions: Position[]): Phaser.Physics.Arcade.Group {
    const coinGroup = this.scene.physics.add.group({ allowGravity: true });

    positions.forEach((pos) => {
      const coin = new Coin({
        scene: this.scene,
        position: pos,
        keyName: ITEMS.COIN,
        frame: 0,
        animation: {
          idle: ITEMS_ANIMATION.COIN.IDLE,
        },
      });
      coinGroup.add(coin);
    });

    return coinGroup;
  }
}
