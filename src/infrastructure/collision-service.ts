export class CollisionService {
  private scene: Phaser.Scene;
  private collideLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public registerCollideLayers(layers: Phaser.Tilemaps.TilemapLayer[]): void {
    this.collideLayers = layers;
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
