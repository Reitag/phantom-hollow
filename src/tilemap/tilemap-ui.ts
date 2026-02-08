import Phaser from 'phaser';

import { Tilemap } from '@/components/map/tilemap';
import { Z_POSITION } from '@/constants/z-position';
import { MAPS } from '@/constants/asset-keys';

export const OBJECTLAYER_NAMES = {
  COORD: 'coord-layer',
} as const;

export function createUiTilemap(scene: Phaser.Scene) {
  const mapKey = MAPS.UI_LEVEL;

  const objectLayersConfig = [
    {
      name: OBJECTLAYER_NAMES.COORD,
      render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
        const name = obj.name;
        if (!name) {
          console.warn('Object missing name for coord-layer of ui-level:', obj);
          return;
        }
      },
    },
  ];

  return new Tilemap(scene, mapKey, undefined, undefined, objectLayersConfig).create();
}
