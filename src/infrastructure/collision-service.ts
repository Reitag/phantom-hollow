export class CollisionService {
  private scene: Phaser.Scene;
  private collideLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public registerLayerCollisions(
    layer: Phaser.Tilemaps.TilemapLayer,
    collisions: {
      entity: Phaser.Types.Physics.Arcade.ArcadeColliderType;
      callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
      type?: 'collide' | 'overlap';
    }[]
  ): void {
    if (!this.collideLayers.includes(layer)) {
      this.collideLayers.push(layer);
    }

    collisions.forEach(({ entity, callback, type = 'collide' }) => {
      const physicsFn =
        type === 'overlap'
          ? this.scene.physics.add.overlap.bind(this.scene.physics.add)
          : this.scene.physics.add.collider.bind(this.scene.physics.add);

      if (callback) {
        physicsFn(entity, layer, callback, undefined, this.scene);
      } else {
        physicsFn(entity, layer);
      }
    });
  }

  public getCollideLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.collideLayers;
  }

  public isCollidingWithTile(x: number, y: number): boolean {
    for (const layer of this.collideLayers) {
      const tile = layer.getTileAtWorldXY(x, y);
      if (tile && tile.collides) return true;
    }
    return false;
  }
}
