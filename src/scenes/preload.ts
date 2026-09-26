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
  private readonly COLORS = {
    textMain: '#b0b7bd',
    textPercent: '#7a848f',
    textStroke: '#000000',
    boxStroke: 0xb0b7bd,
    barFill: 0x7a848f,
    barGlow: 0x8a95a0,
    textError: '#ff6b6b',
  } as const;

  private progressBar: Phaser.GameObjects.Graphics | null = null;
  private progressBox: Phaser.GameObjects.Graphics | null = null;
  private loadingText: Phaser.GameObjects.Text | null = null;
  private percentText: Phaser.GameObjects.Text | null = null;

  private onProgressHandler: ((value: number) => void) | null = null;
  private onLoadErrorHandler: ((file: Phaser.Loader.File) => void) | null = null;

  private hasCriticalError = false;

  constructor() {
    super('PreloadScene');
  }
  public preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();

    this.progressBox.lineStyle(1, this.COLORS.boxStroke, 1);
    this.progressBox.strokeRect(width / 2 - 160, height / 2 - 10, 320, 20);

    this.loadingText = this.make
      .text({
        x: width / 2,
        y: height / 2 - 30,
        text: 'Loading assets...',
        style: { font: '20px "Arial", sans-serif', color: this.COLORS.textMain },
      })
      .setOrigin(0.5, 0.5);
    this.loadingText.setStroke(this.COLORS.textStroke, 2);

    this.percentText = this.make
      .text({
        x: width / 2,
        y: height / 2 + 30,
        text: '0%',
        style: { font: '18px "Arial", sans-serif', color: this.COLORS.textPercent },
      })
      .setOrigin(0.5, 0.5);
    this.percentText.setStroke(this.COLORS.textStroke, 2);

    // Monkey Patching
    /*const originalOpen = XMLHttpRequest.prototype.open;
    const sceneContext = this;

    XMLHttpRequest.prototype.open = function (method, url) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === 2) {
          const contentType = this.getResponseHeader('content-type') || '';

          if (
            typeof url === 'string' &&
            url.includes('.json') &&
            contentType.includes('text/html')
          ) {
            const fakeFile = { key: 'JSON Pack Failure', src: url } as Phaser.Loader.File;
            sceneContext.loadAssetError(fakeFile);

            Object.defineProperty(this, 'status', { writable: true, value: 404 });
          }
        }
      });
      return originalOpen.apply(this, arguments as any);
    };*/

    // Progress bar
    this.onProgressHandler = (value: number) => {
      if (!this.hasCriticalError) {
        this.updateProgressBar(value);
      }
    };
    this.load.on('progress', this.onProgressHandler);

    // Asses load error
    this.onLoadErrorHandler = (file: Phaser.Loader.File) => {
      this.loadAssetError(file);
    };
    this.load.on('loaderror', this.onLoadErrorHandler);

    for (const path of packs) {
      const { key, url } = path;
      this.load.pack(key, url);
    }
  }

  public create() {
    if (this.hasCriticalError) {
      return;
    }

    this.loadingText?.setText('Loading fonts...');
    this.loadingText?.setStyle({ color: this.COLORS.textMain });
    this.updateProgressBar(0);

    let nextSceneDelay = 0;

    this.loadFonts()
      .catch(() => {
        this.loadingText?.setText('Unabled to load fonts.');
        this.loadingText?.setStyle({ color: this.COLORS.textError });

        this.percentText?.setText('FAILED');
        this.percentText?.setStyle({ color: this.COLORS.textError });

        nextSceneDelay = 2500;
      })
      .finally(() => {
        if (this.hasCriticalError && nextSceneDelay === 0) {
          return;
        }

        this.time.delayedCall(nextSceneDelay, () => {
          this.cleanup();

          // Default sound volume
          this.sound.setVolume(1.0);
          this.game.audioService.music.setVolume(0.4); // 40% Volume
          this.game.audioService.sfx.setVolume(0.8); // 80% Volume

          registerGlobalAnimation(this.anims);

          this.scene.start('MainMenuScene');
        });
      });
  }

  private async loadFonts() {
    const totalFonts = fonts.length;
    if (totalFonts === 0) return;

    for (let i = 0; i < totalFonts; i++) {
      const font = fonts[i];
      const fontFace = new FontFace(font.name, `url(${font.url})`, { weight: font.weight });

      await fontFace.load();
      document.fonts.add(fontFace);

      const progressValue = (i + 1) / totalFonts;
      this.updateProgressBar(progressValue);
    }
  }

  private updateProgressBar(value: number) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.percentText?.setText(Math.floor(value * 100) + '%');
    this.progressBar?.clear();

    if (value > 0) {
      const barX = width / 2 - 160;
      const currentWidth = 320 * value;

      this.progressBar?.fillStyle(this.COLORS.barFill, 1);
      this.progressBar?.fillRect(barX + 3, height / 2 - 7, currentWidth - 6, 14);

      this.progressBar?.lineStyle(1, this.COLORS.barGlow, 0.7);
      this.progressBar?.lineBetween(
        barX + 3,
        height / 2 - 7,
        barX + currentWidth - 3,
        height / 2 - 7
      );
    }
  }

  private loadAssetError(file: Phaser.Loader.File): void {
    this.hasCriticalError = true;
    this.load.destroy();

    this.loadingText?.setText(`Critical Error: ${file.key} missing`);
    this.loadingText?.setStyle({ color: this.COLORS.textError });

    this.percentText?.setText('FAILED');
    this.percentText?.setStyle({ color: this.COLORS.textError });
  }

  private cleanup() {
    if (this.onProgressHandler) {
      this.load.off('progress', this.onProgressHandler);
      this.onProgressHandler = null;
    }
    if (this.onLoadErrorHandler) {
      this.load.off('loaderror', this.onLoadErrorHandler);
      this.onLoadErrorHandler = null;
    }

    this.progressBar?.destroy();
    this.progressBox?.destroy();
    this.loadingText?.destroy();
    this.percentText?.destroy();

    this.progressBar = null;
    this.progressBox = null;
    this.loadingText = null;
    this.percentText = null;
  }
}
