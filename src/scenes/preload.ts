import Phaser from 'phaser';

import { registerGlobalAnimation } from '@/animation/loader/animation-loader';

// Packs
const packURL = 'json-packs/';

// Fonts
const fontURL = 'assets/fonts/';
const fontName = 'Volkhov';
const fontWeight = { regular: '400', bold: '700' } as const;

const packs = [
  { key: 'audio-pack', url: `${packURL}audio.json` },
  { key: 'music-pack', url: `${packURL}music.json` },
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

const fonts = [
  {
    name: fontName,
    url: `${fontURL}Volkhov-Regular.ttf`,
    weight: fontWeight.regular,
  },
  {
    name: fontName,
    url: `${fontURL}Volkhov-Bold.ttf`,
    weight: fontWeight.bold,
  },
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

  public async create() {
    await this.loadFonts();

    // Default sound volume
    this.sound.setVolume(1.0);
    this.game.audioService.music.setVolume(0.4); // 40% Volume
    this.game.audioService.sfx.setVolume(0.8); // 80% Volume

    registerGlobalAnimation(this.anims);
    this.scene.start('MainMenuScene');
  }

  private async loadFonts() {
    for (const font of fonts) {
      const fontFace = new FontFace(font.name, `url(${font.url})`, { weight: font.weight });

      await fontFace.load();
      document.fonts.add(fontFace);
    }
  }
}
