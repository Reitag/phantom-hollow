import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Item } from '@/base/objects/item';
import { Player } from '@/entities/characters/player/player';
import { Coin } from '@/entities/items/coin';
import { ItemFactory } from '@/factories/item-factory';
import { Position } from '@/utils/types';

export class PickupSystem {
  private itemGroups = new Map<string, Phaser.Physics.Arcade.Group>();
  private itemFactory: ItemFactory;

  constructor(private scene: Phaser.Scene) {
    this.itemFactory = new ItemFactory(this.scene);
  }

  public spawnCoins(key: string, positions: Position[]): void {
    const coinGroup = this.itemFactory.createCoinGroup(positions);
    const player = ServiceLocator.resolve(ServiceKeys.player);

    this.scene.physics.add.overlap(
      player,
      coinGroup,
      this.handlePickup as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.itemGroups.set(key, coinGroup);
  }

  public getGroup(key: string): Phaser.Physics.Arcade.Group | undefined {
    return this.itemGroups.get(key);
  }

  private handlePickup(player: Phaser.GameObjects.GameObject, item: Item): void {
    if (player instanceof Player && item instanceof Coin) {
      player.getCoinKeeper().addCoins(1);
    }

    item.destroy();
    this.removeItem(item);
  }

  private removeItem(item: Item): void {
    for (const group of this.itemGroups.values()) {
      if (group.contains(item)) {
        group.remove(item, true, true);
        break;
      }
    }

    for (const [key, group] of this.itemGroups) {
      if (group.countActive(true) === 0) {
        this.itemGroups.delete(key);
      }
    }
  }

  public clear(): void {
    for (const group of this.itemGroups.values()) {
      group.clear(true, true);
    }
    this.itemGroups.clear();
  }
}
