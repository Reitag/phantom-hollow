import Phaser from 'phaser';

import { INVENTORY_SLOTS } from '@/constants/ui-coordinates';
import { Position } from '@/utils/types';
import { ICON_SIZE } from '@/constants/ui';

export class IconHighlighter {
  private readonly ICON_SIZE = ICON_SIZE;

  private spellHighlight: Phaser.GameObjects.Rectangle | null = null;
  private slotHighlight: Phaser.GameObjects.Rectangle | null = null;

  constructor(private scene: Phaser.Scene) {}

  public addSpellHighlight(coordinates: Position): void {
    if (this.spellHighlight) return;

    this.spellHighlight = this.scene.add
      .rectangle(coordinates.x, coordinates.y, this.ICON_SIZE, this.ICON_SIZE)
      .setOrigin(0)
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
