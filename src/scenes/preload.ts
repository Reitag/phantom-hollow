import Phaser from 'phaser';

import { registerGlobalAnimation } from '@/animation/loader/animation-loader';

const packURL = '/json-packs/';

const packs = [
  { key: 'tilesets-pack', url: `${packURL}tilesets.json` },
  { key: 'backgrounds-pack', url: `${packURL}backgrounds.json` },
  { key: 'objects-pack', url: `${packURL}objects.json` },
  { key: 'maps-pack', url: `${packURL}maps.json` },
  { key: 'ui-pack', url: `${packURL}ui.json` },
  { key: 'items-pack', url: `${packURL}items.json` },
  { key: 'characters-pack', url: `${packURL}characters.json` },
  { key: 'spells-pack', url: `${packURL}spells.json` },
  { key: 'misc-pack', url: `${packURL}misc.json` },
  { key: 'weapon-pack', url: `${packURL}weapons.json` },
  { key: 'vfx-pack', url: `${packURL}vfx.json` },
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  public preload() {
    for (const path of packs) {
      const { key, url } = path;
      this.load.pack(key, url);
    }
  }
  public create() {
    registerGlobalAnimation(this.anims);
    this.scene.start('MainMenuScene');
  }
}
