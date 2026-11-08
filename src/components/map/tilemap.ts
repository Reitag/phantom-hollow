import {
  TilesetConfig,
  TileLayerConfig,
  ObjectLayerConfig,
  LayerDepths,
} from '@/components/map/tilemap-types';

export class Tilemap {
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private tilesets: Record<string, Phaser.Tilemaps.Tileset> = {};
  private tileLayers: Record<string, Phaser.Tilemaps.TilemapLayer> = {};
  private objectLayers: Record<string, Phaser.Tilemaps.ObjectLayer> = {};

  constructor(
    private scene: Phaser.Scene,
    private mapKey: string,
    private tilesetsConfig?: TilesetConfig[],
    private tileLayersConfig?: TileLayerConfig[],
    private objectLayersConfig?: ObjectLayerConfig[],
    private layerDepths: LayerDepths = {}
  ) {}

  public create(): this {
    this.tilemap = this.scene.make.tilemap({ key: this.mapKey });

    this.createTilesets();
    this.createTileLayers();
    this.createObjectLayers();

    this.scene.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    return this;
  }

  private createTilesets(): void {
    if (!this.tilesetsConfig) return;

    for (const {
      name,
      key,
      tileWidth = this.tilemap.tileWidth,
      tileHeight = this.tilemap.tileHeight,
      margin = 0,
      spacing = 0,
    } of this.tilesetsConfig) {
      const tileset = this.tilemap.addTilesetImage(
        name,
        key,
        tileWidth,
        tileHeight,
        margin,
        spacing
      );

      if (!tileset) {
        console.warn(`Tileset '${name}' with key '${key}' could not be loaded.`);
        continue;
      }
      this.tilesets[name] = tileset;
    }
  }

  private createTileLayers(): void {
    if (!this.tileLayersConfig) return;

    for (const { name, tilesets, x, y, collide } of this.tileLayersConfig) {
      const ts = tilesets
        .map((tsName) => this.tilesets[tsName])
        .filter((ts): ts is Phaser.Tilemaps.Tileset => ts !== null);

      const layer = this.tilemap.createLayer(name, ts, x, y);

      if (layer) {
        layer.setDepth(this.layerDepths[name] ?? 0);
        if (collide) {
          layer.setCollisionByProperty({ collides: true });
        }
        this.tileLayers[name] = layer;
      } else {
        console.warn(`Tilelayer '${name}' with tilesets '${tilesets}' could not be loaded.`);
      }
    }
  }

  private createObjectLayers(): void {
    if (!this.objectLayersConfig) return;

    for (const { name, render } of this.objectLayersConfig) {
      const layer = this.tilemap.getObjectLayer(name);

      if (!layer) {
        console.warn(`Object layer "${name}" not found`);
        continue;
      }

      this.objectLayers[name] = layer;

      if (render) {
        const depth = this.layerDepths[name] ?? 0;
        layer.objects.forEach((obj) => render.call(this.scene, obj, depth));
      }
    }
  }

  public getTileLayer(name: string): Phaser.Tilemaps.TilemapLayer | null {
    return this.tileLayers[name] ?? null;
  }

  public getObjectLayer(name: string): Phaser.Tilemaps.ObjectLayer | null {
    return this.objectLayers[name] ?? null;
  }

  public getTilemap(): Phaser.Tilemaps.Tilemap {
    return this.tilemap;
  }
}
