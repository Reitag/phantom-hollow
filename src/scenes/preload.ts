import Phaser from 'phaser';

import { registerGlobalAnimation } from '@/data/animation/animation-loader';

const packURL = 'src/data/json-packs/';

const packs = [
  { key: 'tilesets-pack', url: `${packURL}tilesets.json` },
  { key: 'objects-pack', url: `${packURL}objects.json` },
  { key: 'maps-pack', url: `${packURL}maps.json` },
  { key: 'ui-pack', url: `${packURL}ui.json` },
  { key: 'characters-pack', url: `${packURL}characters.json` },
  { key: 'spells-pack', url: `${packURL}spells.json` },
  { key: 'misc-pack', url: `${packURL}misc.json` },
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    for (const path of packs) {
      const { key, url } = path;
      this.load.pack(key, url);
    }
  }
  create() {
    registerGlobalAnimation(this.anims);
    this.scene.start('LevelOneScene');
  }
}
