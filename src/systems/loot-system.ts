import { ItemFactory } from '@/factories/item-factory';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { Position } from '@/utils/types';

export class LootSystem {
  private itemFactory: ItemFactory;

  constructor(scene: Phaser.Scene) {
    this.itemFactory = new ItemFactory(scene);
  }

  public spawnCoins(positions: Position[]): void {
    const group = CollisionService.resolveGroup(GroupKeys.item);
    if (!group) return;

    const coinGroup = this.itemFactory.createCoinGroup(positions);
    coinGroup.forEach((coin) => {
      group.add(coin, true);

      coin.scene.time.delayedCall(15000, () => {
        if (coin.active) {
          coin.scene.tweens.add({
            targets: coin,
            alpha: 0.2,
            duration: 200,
            ease: 'Linear',
            yoyo: true,
            repeat: 6,
            onComplete: () => {
              coin.destroy(true);
            },
          });
        }
      });
    });
  }
}
