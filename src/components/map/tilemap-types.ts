export interface TilesetConfig {
  name: string;
  key: string;
}

export interface TileLayerConfig {
  name: string;
  tilesets: string[];
  x: number;
  y: number;
  collide?: boolean;
}

export interface ObjectLayerConfig {
  name: string;
  render?: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => void;
}

export type LayerDepths = Record<string, number>;
