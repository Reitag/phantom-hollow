import { Panel, PanelConfig } from '@/base/ui/panel';
import { ITEM_TOOLTIPS } from '@/constants/tooltip-params';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { IconDragContext } from '@/utils/types';

export class InventoryPanel extends Panel {
  constructor({ scene, slotOffSet, cell }: PanelConfig) {
    super({
      scene: scene,
      slotOffSet: slotOffSet,
      cell: cell,
    });
  }

  public setIcon(index: number, key: string, quantity: number): void {
    const slot = this.slots[index];
    const pos = this.getCellPosition(index);

    // Icon
    if (!slot.icon) {
      // create icon
      slot.icon = this.scene.add
        .image(pos.x + this.ICON_BORDER, pos.y + this.ICON_BORDER, key)
        .setOrigin(0, 0)
        .setDisplaySize(this.ICON_SIZE, this.ICON_SIZE)
        .setDepth(this.ICON_DEPTH)
        .setData('index', index)
        .setData('key', key);

      // bind icon
      this.clickBinder.set(slot.icon, index, this.clickContext);
      this.dragBinder.set(slot.icon, this.dragContext);

      if (this.spellInputEnabled) {
        this.clickBinder.bind(slot.icon);
      } else {
        this.dragBinder.bind(slot.icon);
        slot.icon.setTint(0xa8a8a8);
      }
    } else {
      // reuse icon
      slot.icon
        .setTexture(key)
        .setPosition(pos.x + this.ICON_BORDER, pos.y + this.ICON_BORDER)
        .setData('key', key);
    }

    // Quantity text
    if (!slot.quantityText) {
      slot.quantityText = this.scene.add
        .text(pos.x + 26, pos.y + 21, quantity.toString(), {
          fontSize: '12px',
          color: '#fff',
          stroke: '#000',
          strokeThickness: 2,
        })
        .setDepth(11);
    } else {
      slot.quantityText.setText(quantity.toString());
    }

    // Key bind
    if (!slot.keyBind) {
      slot.keyBind = this.createKeyBindText(index, this.slotOffset);
    }
  }

  public removeIcon(index: number): void {
    const slot = this.slots[index];
    if (!slot) return;

    if (slot.icon) {
      this.clickBinder.unbind(slot.icon);
      this.dragBinder.unbind(slot.icon);
      this.clickBinder.delete(slot.icon);
      this.dragBinder.delete(slot.icon);
      slot.icon.destroy();
    }

    slot.keyBind?.destroy();
    slot.quantityText?.destroy();

    this.slots[index] = {
      icon: undefined,
      keyBind: this.createKeyBindText(index, this.slotOffset),
      quantityText: undefined,
    };
  }

  protected triggerTooltip(index: number): void {
    const icon = this.slots[index].icon;
    if (icon && this.dragContext.onHover) {
      this.dragContext.onHover(icon);
    }
  }

  protected emitSlotRelease(slotIndex: number): void {
    const itemIndex = this.slots[slotIndex].icon?.getData('index');
    if (itemIndex === undefined) return;

    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    inventory.useSlot(itemIndex);
  }

  protected dragContext: IconDragContext = {
    onHover: (icon: Phaser.GameObjects.Image) => {
      const keyItem = icon.getData('key');
      const info = Object.values(ITEM_TOOLTIPS).find((tooltip) => tooltip.id === keyItem);
      if (!info) return;

      const ui = ServiceLocator.resolve(ServiceKeys.ui);

      ui.showVerticalTooltip(
        {
          x: icon.x - 220,
          y: icon.y - 20,
          width: 280,
          fillColor: 0x000000,
        },
        info
      );
    },

    onHoverOut: () => {
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.hideTooltip();
    },

    onDragStart: (icon: Phaser.GameObjects.Image) => {
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.hideTooltip();

      this.scene.game.canvas.style.cursor = 'grab';
      icon.setDepth(icon.depth + this.depthGap);
    },

    onDrag: (icon: Phaser.GameObjects.Image, x: number, y: number) => {
      icon.setPosition(x, y);
    },

    onDragEnd: (icon: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'default';

      const fromIndex = this.slots.findIndex((s) => s.icon === icon);
      if (fromIndex === -1) return;

      const dropIndex = this.getIndex({ x: pointer.x, y: pointer.y });

      if (dropIndex !== -1 && dropIndex !== fromIndex) {
        const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
        inventory.swapSlots(fromIndex, dropIndex);
        icon.setDepth(icon.depth - this.depthGap);
        return;
      }

      if (dropIndex === -1) {
        this.confirmDestroy(fromIndex);
        icon.setDepth(icon.depth - this.depthGap);
        return;
      }

      this.moveItemToIndex(fromIndex);
      icon.setDepth(icon.depth - this.depthGap);
    },
  };

  private confirmDestroy(fromIndex: number): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

    const dialog = ui.addWarningDialog('Do you want to destroy this item?');

    dialog.once('confirm', () => {
      inventory.destroySlot(fromIndex);
      dialog.destroy();
    });

    dialog.once('cancel', () => {
      inventory.updateUI();
      dialog.destroy();
    });
  }

  private moveItemToIndex(index: number): void {
    const slot = this.slots[index];
    if (!slot.icon) return;

    const pos = this.getCellPosition(index);

    slot.icon.setPosition(pos.x + this.ICON_BORDER, pos.y + this.ICON_BORDER);

    if (slot.quantityText) {
      slot.quantityText.setPosition(pos.x + 26, pos.y + 21);
    }
  }
}
