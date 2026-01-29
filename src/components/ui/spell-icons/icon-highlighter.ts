import Phaser from 'phaser';

import { INVENTORY_SLOTS } from '@/constants/ui-coordinates';
import { Position } from '@/utils/types';
import { ICONS } from '@/constants/ui';

export class IconHighlighter {
  private readonly ICON_SIZE = ICONS.SIZE;
  private readonly ICON_BORDER = ICONS.BORDER;

  private spellHighlight: Phaser.GameObjects.Rectangle | null = null;
  private slotHover: Phaser.GameObjects.Rectangle | null = null;

  constructor(private scene: Phaser.Scene) {}

  public addSlotHoverEffect(coordinates: Position): void {
    if (this.slotHover) return;

    this.slotHover = this.scene.add
      .rectangle(
        coordinates.x + this.ICON_BORDER,
        coordinates.y + this.ICON_BORDER,
        this.ICON_SIZE,
        this.ICON_SIZE
      )
      .setOrigin(0)
      .setFillStyle(0xfce2bd, 0.2)
      .setStrokeStyle(2, 0xffcc85, 0.2);
  }

  public addSpellHighlight(coordinates: Position): void {
    if (this.spellHighlight) return;

    this.removeSlotHoverEffect();

    this.spellHighlight = this.scene.add
      .rectangle(
        coordinates.x + this.ICON_BORDER,
        coordinates.y + this.ICON_BORDER,
        this.ICON_SIZE,
        this.ICON_SIZE
      )
      .setOrigin(0)
      .setDepth(ICONS.DEPTH)
      .setFillStyle(0xfff8c9, 0.4)
      .setStrokeStyle(2, 0xffffff, 1);
  }

  public removeSpellHighlight(): void {
    if (this.spellHighlight) {
      this.spellHighlight.destroy();
      this.spellHighlight = null;
    }
  }

  public removeSlotHoverEffect(): void {
    if (this.slotHover) {
      this.slotHover.destroy();
      this.slotHover = null;
    }
  }
}
