import Phaser from 'phaser';

import { iconOverlays } from '@/utils/coordinates';

export class SpellIconHighlighter {
  private scene: Phaser.Scene;
  private highlightRect: Phaser.GameObjects.Rectangle | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addHighlight(spellKey: string): void {
    if (this.highlightRect) return;

    const position = iconOverlays[spellKey];
    if (!position) return;

    const size = 32;
    this.highlightRect = this.scene.add
      .rectangle(position.x, position.y, size, size)
      .setOrigin(0.5)
      .setFillStyle(0xfff8c9, 0.4)
      .setStrokeStyle(2, 0xffffff, 1);
  }

  removeHighlight(): void {
    if (this.highlightRect) {
      this.highlightRect.destroy();
      this.highlightRect = null;
    }
  }
}
