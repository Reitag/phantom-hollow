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
    });
  }
}
