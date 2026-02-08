import { ICONS } from '@/constants/ui';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { IconHighlighter } from '@/components/ui/spell-icons/icon-highlighter';
import { IconClickBinder, IconDragBinder } from '@/infrastructure/icon-binders';
import { getUiCoords } from '@/utils/helpers';
import { IconClickContext, Position } from '@/utils/types';
import { InputController } from '../input/input-controller';

export type SlotConfig = {
  icon: Phaser.GameObjects.Image | undefined;
  keyBind: Phaser.GameObjects.Text | undefined;
  quantityText: Phaser.GameObjects.Text | undefined;
};

export interface PanelConfig {
  scene: Phaser.Scene;
  slotOffSet: number;
  cell: {
    slotKeys: string[];
    imageKey: string;
  };
}

export abstract class Panel {
  protected readonly ICON_SIZE = ICONS.SIZE;
  protected readonly ICON_BORDER = ICONS.BORDER;
  protected readonly ICON_DEPTH = ICONS.DEPTH;

  protected spellInputEnabled = true;

  protected readonly depthGap = 100;
  protected scene: Phaser.Scene;
  protected slotOffset: number;
  protected cells: Phaser.GameObjects.Image[] = [];
  protected slots: SlotConfig[] = [];
  protected iconHighlighter: IconHighlighter;
  protected clickBinder: IconClickBinder;
  protected dragBinder: IconDragBinder;

  constructor({ scene, slotOffSet, cell }: PanelConfig) {
    this.scene = scene;
    this.slotOffset = slotOffSet;
    const { slotKeys, imageKey } = cell;

    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    slotKeys.forEach((key) => {
      const pos = getUiCoords(uiCoords, key);
      const cell = scene.add.image(pos.x, pos.y, imageKey).setOrigin(0, 0);

      this.cells.push(cell);
    });

    this.slots = Array.from({ length: this.cells.length }, (_, index) => ({
      icon: undefined,
      keyBind: this.createKeyBindText(index, this.slotOffset).setDepth(this.ICON_DEPTH + 1),
      quantityText: undefined,
    }));

    this.iconHighlighter = new IconHighlighter(scene);

    // Binders
    this.clickBinder = new IconClickBinder();
    this.dragBinder = new IconDragBinder(scene);
  }

  public get cellQuantity(): number {
    return this.cells.length;
  }

  public update(input: InputController): void {
    if (input.isUtilityDown) {
      this.disableSpellInput();
      return;
    }

    if (!input.isUtilityDown) {
      this.enableSpellInput();
    }

    for (let localIndex = 0; localIndex < this.cells.length; localIndex++) {
      const globalIndex = this.slotOffset + localIndex;

      if (input.isSlotDown(globalIndex)) {
        this.iconHighlighter.addSpellHighlight(this.getCellPosition(localIndex));
      } else if (input.isSlotReleased(globalIndex)) {
        this.iconHighlighter.removeSpellHighlight();
        this.emitSlotRelease(localIndex);
      }
    }
  }

  public getIndex(position: Position): number {
    return this.cells.findIndex(
      (cell) =>
        position.x >= cell.x &&
        position.x <= cell.x + cell.displayWidth &&
        position.y >= cell.y &&
        position.y <= cell.y + cell.displayHeight
    );
  }

  protected abstract emitSlotRelease(i: number): void;

  protected clickContext: IconClickContext = {
    onHover: (i) => {
      this.iconHighlighter.addSlotHoverEffect(this.getCellPosition(i));
    },

    onHoverOut: () => {
      this.iconHighlighter.removeSpellHighlight();
      this.iconHighlighter.removeSlotHoverEffect();
    },

    onPress: (i) => {
      const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
      if (player.getDead()) return;

      this.iconHighlighter.addSpellHighlight(this.getCellPosition(i));
    },

    onRelease: (i) => {
      const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
      if (player.getDead()) return;

      this.iconHighlighter.removeSpellHighlight();
      this.emitSlotRelease(i);
    },
  };

  protected createKeyBindText(localIndex: number, offset: number): Phaser.GameObjects.Text {
    const input = ServiceLocator.resolve(ServiceKeys.input);
    const label = input.getSlotLabel(offset + localIndex);

    const pos = this.getCellPosition(localIndex);

    return this.scene.add
      .text(pos.x + 22, pos.y - 5, label, {
        font: '12px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0, 0)
      .setDepth(10)
      .setAlpha(0.9);
  }

  protected getCellPosition(index: number): Position {
    return {
      x: this.cells[index].x,
      y: this.cells[index].y,
    };
  }

  protected destroyCells(): void {
    this.cells.forEach((cell) => cell.destroy());
    this.cells.length = 0;
  }

  private disableSpellInput(): void {
    if (!this.spellInputEnabled) return;

    this.forceClearHoverState();

    for (const slot of this.slots) {
      if (slot.icon !== undefined) {
        this.clickBinder.unbind(slot.icon);
        this.dragBinder.bind(slot.icon);

        slot.icon.setTint(0xa8a8a8);
      }
    }

    this.spellInputEnabled = false;
  }

  private enableSpellInput(): void {
    if (this.spellInputEnabled) return;

    this.forceClearHoverState();

    for (const slot of this.slots) {
      if (slot.icon !== undefined) {
        this.dragBinder.unbind(slot.icon);
        this.clickBinder.bind(slot.icon);

        slot.icon.clearTint();
      }
    }

    this.spellInputEnabled = true;
    this.alignIcons();
  }

  private forceClearHoverState(): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.hideTooltip();
    this.iconHighlighter.removeSpellHighlight();
    this.iconHighlighter.removeSlotHoverEffect();
  }

  private alignIcons(): void {
    for (let i = 0; i < this.slots.length; ++i) {
      const pos = this.getCellPosition(i);
      const icon = this.slots[i].icon;

      if (icon === undefined) continue;
      icon.setPosition(pos.x + this.ICON_BORDER, pos.y + this.ICON_BORDER);

      if (icon.depth !== this.ICON_DEPTH) {
        icon.setDepth(this.ICON_DEPTH);
      }
    }
  }
}
