import { Item } from '@/base/objects/item';
import { ITEMS } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Player } from '@/entities/characters/player/player';
import { Coin } from '@/entities/items/coin';
import { ItemFactory } from '@/factories/item-factory';
import { Position } from '@/utils/types';

export class LootSystem {
  private itemGroups = new Map<string, Phaser.Physics.Arcade.Group>();
  private itemFactory: ItemFactory;

  constructor(private scene: Phaser.Scene) {
    this.itemFactory = new ItemFactory(this.scene);
    this.itemGroups.set(ITEMS.COIN, this.scene.physics.add.group({ allowGravity: true }));
  }

  public setCollideLayersAndItemsOverlap(collideLayers: Phaser.Tilemaps.TilemapLayer[]): void {
    this.itemGroups.forEach((group) => {
      collideLayers.forEach((collideLayer) => {
        this.scene.physics.add.collider(group, collideLayer);
      });
    });

    this.setItemsOverlap();
  }

  public spawnCoins(positions: Position[]): void {
    const key = ITEMS.COIN;

    const group = this.itemGroups.get(key);
    if (!group) return;

    const coinGroup = this.itemFactory.createCoinGroup(positions);
    coinGroup.forEach((coin) => {
      group.add(coin, true);
    });
  }

  public getGroupByKey(key: string): Phaser.Physics.Arcade.Group | undefined {
    return this.itemGroups.get(key);
  }

  private setItemsOverlap(): void {
    const player = ServiceLocator.resolve(ServiceKeys.player);

    this.itemGroups.forEach((group) => {
      this.scene.physics.add.overlap(
        player,
        group,
        this.handlePickup as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
    });
  }

  private handlePickup(player: Phaser.GameObjects.GameObject, item: Item): void {
    if (player instanceof Player && item instanceof Coin) {
      player.getCoinKeeper().addCoins(1);
    }

    item.destroy();
  }

  public clear(): void {
    this.itemGroups.clear();
  }
}
