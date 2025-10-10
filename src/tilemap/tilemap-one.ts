import Phaser from 'phaser';

import { Tilemap } from '@/components/map/tilemap';
import { Z_POSITION } from '@/constants/z-position';
import { MAPS, TILESETS } from '@/constants/asset-keys';

export const TILESET_NAMES = {
  ANCIENT: 'ancient-tile',
  GROUND: 'ground-tile',
  CLIFF: 'cliff-tile',
  GRASS: 'grass-tile',
  COLLIDE: 'collide-tile',
  DIRT: 'dirt-tile',
} as const;

export const TILELAYER_NAMES = {
  SPEAR: 'spear-layer',
  BUSH: 'bush-layer',
  CAVE: 'cave-layer',
  CAVE_BACKGROUND: 'cave-background-layer',
  PLATFORM_BG: 'platform-bg-layer',
  GROUND: 'ground-layer',
  SPIKE: 'spike-layer',
  PLATFORM: 'platform-layer',
  COLLIDE: 'collide-layer',
} as const;

export const OBJECTLAYER_NAMES = {
  STORE: 'store-layer',
  DECOR: 'decor-layer',
  ROCK: 'rock-layer',
  TREE_NORMAL: 'tree-normal-layer',
  TREE_SHADOW: 'tree-shadow-layer',
} as const;

export function createTilemapOne(scene: Phaser.Scene) {
  const mapKey = MAPS.LEVEL_1;

  const tilesetsConfig = [
    { name: TILESET_NAMES.ANCIENT, key: TILESETS.ANCIENT_TILES },
    { name: TILESET_NAMES.GROUND, key: TILESETS.GROUND },
    { name: TILESET_NAMES.CLIFF, key: TILESETS.CLIFF },
    { name: TILESET_NAMES.GRASS, key: TILESETS.GRASS_2 },
    { name: TILESET_NAMES.COLLIDE, key: TILESETS.COLLIDE },
    { name: TILESET_NAMES.DIRT, key: TILESETS.DIRT },
  ];
  const tileLayersConfig = [
    {
      name: TILELAYER_NAMES.COLLIDE,
      tilesets: [TILESET_NAMES.COLLIDE],
      x: 0,
      y: 0,
      collide: true,
    },
    {
      name: TILELAYER_NAMES.SPEAR,
      tilesets: [TILESET_NAMES.ANCIENT],
      x: 0,
      y: 0,
      collide: true,
    },
    {
      name: TILELAYER_NAMES.BUSH,
      tilesets: [TILESET_NAMES.GRASS],
      x: 0,
      y: 0,
      collide: false,
    },
    {
      name: TILELAYER_NAMES.PLATFORM_BG,
      tilesets: [TILESET_NAMES.ANCIENT],
      x: 0,
      y: 0,
      collide: false,
    },
    {
      name: TILELAYER_NAMES.CAVE,
      tilesets: [TILESET_NAMES.GROUND],
      x: 0,
      y: 0,
      collide: true,
    },
    {
      name: TILELAYER_NAMES.CAVE_BACKGROUND,
      tilesets: [TILESET_NAMES.DIRT],
      x: 0,
      y: 0,
      collide: false,
    },
    {
      name: TILELAYER_NAMES.GROUND,
      tilesets: [TILESET_NAMES.ANCIENT, TILESET_NAMES.GROUND, TILESET_NAMES.CLIFF],
      x: 0,
      y: 0,
      collide: true,
    },
    {
      name: TILELAYER_NAMES.SPIKE,
      tilesets: [TILESET_NAMES.GROUND],
      x: 0,
      y: 0,
      collide: true,
    },
    {
      name: TILELAYER_NAMES.PLATFORM,
      tilesets: [TILESET_NAMES.ANCIENT],
      x: 0,
      y: 0,
      collide: true,
    },
  ];
  const objectLayersConfig = [
    {
      name: OBJECTLAYER_NAMES.STORE,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for tree-layer:', obj);
          return;
        }

        const image = scene.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
        image.setDepth(depth);
      },
    },
    {
      name: OBJECTLAYER_NAMES.DECOR,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for tree-layer:', obj);
          return;
        }

        const image = scene.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
        image.setDepth(depth);
      },
    },
    {
      name: OBJECTLAYER_NAMES.ROCK,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for tree-layer:', obj);
          return;
        }

        const image = scene.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
        image.setDepth(depth);
      },
    },
    {
      name: OBJECTLAYER_NAMES.TREE_NORMAL,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for tree-layer:', obj);
          return;
        }

        const image = scene.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
        image.setDepth(depth);
      },
    },
    {
      name: OBJECTLAYER_NAMES.TREE_SHADOW,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for tree-layer:', obj);
          return;
        }

        const image = scene.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
        image.setDepth(depth);
      },
    },
  ];
  const layerDepths = {
    [TILELAYER_NAMES.PLATFORM]: Z_POSITION.PLATFORMS,
    [TILELAYER_NAMES.SPIKE]: Z_POSITION.SPIKE,
    [TILELAYER_NAMES.GROUND]: Z_POSITION.GROUND,
    [OBJECTLAYER_NAMES.TREE_NORMAL]: Z_POSITION.TREES_NORMAL,
    [OBJECTLAYER_NAMES.TREE_SHADOW]: Z_POSITION.TREES_SHADOW,
    [OBJECTLAYER_NAMES.STORE]: Z_POSITION.STORE,
    [OBJECTLAYER_NAMES.DECOR]: Z_POSITION.DECOR,
    [OBJECTLAYER_NAMES.ROCK]: Z_POSITION.ROCK,
    [TILELAYER_NAMES.BUSH]: Z_POSITION.BUSH,
    [TILELAYER_NAMES.SPEAR]: Z_POSITION.SPEAR,
    [TILELAYER_NAMES.COLLIDE]: Z_POSITION.COLLIDE,
    [TILELAYER_NAMES.PLATFORM_BG]: Z_POSITION.PLATFORM_BG,
    [TILELAYER_NAMES.CAVE_BACKGROUND]: Z_POSITION.CAVE_BACKGROUND,
    [TILELAYER_NAMES.CAVE]: Z_POSITION.CAVE,
  };

  return new Tilemap(
    scene,
    mapKey,
    tilesetsConfig,
    tileLayersConfig,
    objectLayersConfig,
    layerDepths
  ).create();
}
