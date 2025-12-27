import Phaser from 'phaser';

import {
  TilesetConfig,
  TileLayerConfig,
  ObjectLayerConfig,
  LayerDepths,
} from '@/components/map/tilemap-types';

/**
 * Handles creation of a Tiled map, including tilesets, tile layers, object layers, and layer depth setup.
 *
 * @param {Phaser.Scene} scene - The current Phaser scene where the map is being used.
 * @param {string} mapKey - The key of the Tiled map as loaded via `this.load.tilemapTiledJSON(...)`.
 * @param {Array<{ name: string, key: string }>} tilesetsConfig - Array of tileset config objects:
 *    - `name` must match the tileset name in your `.tmj` file.
 *    - `key` must match the tileset image key preloaded with Phaser.
 * @param {Array<{
 *    name: string,
 *    tilesets: string[],
 *    x?: number,
 *    y?: number,
 *    collide?: boolean
 * }>} tileLayersConfig - Array of tile layer configurations:
 *    - `name` must match the layer name in Tiled.
 *    - `tilesets` is an array of tileset names used in that layer.
 *    - `x`, `y` are optional positions.
 *    - `collide` determines if the layer should be set to collide using `collides: true` properties.
 * @param {Array<{
 *    name: string,
 *    render?: (obj: any, depth: number) => void
 * }>} objectLayersConfig - Array of object layer configurations:
 *    - `name` must match the object layer name in Tiled.
 *    - `render` is an optional callback to create game objects from Tiled objects.
 * @param {Record<string, number>} layerDepths - A map of layer names to their rendering depth (Phaser depth system).
 */

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

    for (const { name, key } of this.tilesetsConfig) {
      const tileset = this.tilemap.addTilesetImage(name, key);

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
