type LayerConfig = {
  name: string;
  layer: Phaser.Tilemaps.TilemapLayer;
};

export const GroupKeys = {
  enemy: 'enemy',
  spell: 'spell',
  weapon: 'weapon',
  item: 'item',
} as const;

export class CollisionService {
  private static layers = new Set<LayerConfig>();
  private static groups = new Map<string, Phaser.Physics.Arcade.Group>();

  public static registerLayer(layer: LayerConfig): void {
    if (![...this.layers].some((l) => l.name === layer.name)) {
      this.layers.add(layer);
    }
  }

  public static registerGroup(name: string, group: Phaser.Physics.Arcade.Group): void {
    if (!this.groups.has(name)) {
      this.groups.set(name, group);
    }
  }

  public static resolveLayer(name: string): Phaser.Tilemaps.TilemapLayer | undefined {
    for (const layer of this.layers) {
      if (layer.name === name) {
        return layer.layer;
      }
    }
    return undefined;
  }

  public static resolveGroup(name: string): Phaser.Physics.Arcade.Group | undefined {
    return this.groups.get(name);
  }

  public static registerCollisions(
    scene: Phaser.Scene,
    target:
      | Phaser.Tilemaps.TilemapLayer
      | Phaser.Physics.Arcade.Group
      | Phaser.GameObjects.GameObject
      | undefined,
    collisions: {
      entity: Phaser.Types.Physics.Arcade.ArcadeColliderType | undefined;
      callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
      type?: 'collide' | 'overlap';
    }[]
  ): void {
    const physics = scene.physics;

    const isTilemapLayer = target instanceof Phaser.Tilemaps.TilemapLayer;
    const isGroup = target instanceof Phaser.Physics.Arcade.Group;
    const isGameObject = target instanceof Phaser.GameObjects.GameObject;

    if (!isTilemapLayer && !isGroup && !isGameObject) {
      throw new Error('[CollisionService] Unsupported collision target type:', target);
    }

    collisions.forEach(({ entity, callback, type = 'collide' }) => {
      if (!entity) throw new Error('[CollisionService] Unsupported entity type:', entity);
      const fn =
        type === 'overlap'
          ? physics.add.overlap.bind(physics.add)
          : physics.add.collider.bind(physics.add);

      if (callback) fn(entity, target, callback, undefined, scene);
      else fn(entity, target);
    });
  }

  public isEntityColliding(entity: Phaser.GameObjects.Sprite): boolean {
    const bounds = entity.getBounds();
    const samplePoints = [
      { x: bounds.left, y: bounds.bottom - 1 },
      { x: bounds.right, y: bounds.bottom - 1 },
      { x: bounds.centerX, y: bounds.bottom - 1 },
    ];

    for (const point of samplePoints) {
      if (this.isCollidingWithTile(point.x, point.y)) {
        return true;
      }
    }
    return false;
  }

  public isCollidingWithTile(x: number, y: number): boolean {
    for (const layer of CollisionService.layers) {
      const tile = layer.layer.getTileAtWorldXY(x, y);
      if (tile && tile.collides) return true;
    }
    return false;
  }
}
