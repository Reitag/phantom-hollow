import Phaser from 'phaser';

import { ICON_OVERLAYS, INVENTORY_SLOTS } from '@/constants/ui-coordinates';

export class IconHighlighter {
  private scene: Phaser.Scene;
  private spellHighlight: Phaser.GameObjects.Rectangle | null = null;
  private slotHighlight: Phaser.GameObjects.Rectangle | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public addSpellHighlight(spellKey: string): void {
    if (this.spellHighlight) return;

    const key = spellKey as keyof typeof ICON_OVERLAYS;
    const position = ICON_OVERLAYS[key];
    if (!position) return;

    const size = 32;
    this.spellHighlight = this.scene.add
      .rectangle(position.X, position.Y, size, size)
      .setOrigin(0.5)
      .setFillStyle(0xfff8c9, 0.4)
      .setStrokeStyle(2, 0xffffff, 1);
  }

  public removeSpellHighlight(): void {
    if (this.spellHighlight) {
      this.spellHighlight.destroy();
      this.spellHighlight = null;
    }
  }

  public addSlotHighlight(index: number): void {
    if (this.slotHighlight) return;

    const posX = 25 + index * (INVENTORY_SLOTS.WIDTH + INVENTORY_SLOTS.PADDING);
    const position = {
      x: posX,
      y: INVENTORY_SLOTS.Y,
    };
    const size = 24;
    this.slotHighlight = this.scene.add
      .rectangle(position.x, position.y, size, size)
      .setOrigin(0.5)
      .setFillStyle(0xfff8c9, 0.4)
      .setStrokeStyle(2, 0xffffff, 1);

    this.removeSlotHighlight();
  }

  private removeSlotHighlight(): void {
    if (this.slotHighlight) {
      this.scene.tweens.add({
        targets: this.slotHighlight,
        alpha: 0,
        duration: 200,
        ease: 'Sine.easeIn',
        onComplete: () => {
          this.slotHighlight?.destroy();
          this.slotHighlight = null;
        },
      });
    }
  }
}
