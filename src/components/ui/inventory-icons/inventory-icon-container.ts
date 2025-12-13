import { ITEM_TOOLTIPS } from '@/constants/tooltip-params';
import { INVENTORY_SLOTS } from '@/constants/ui-coordinates';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

type InventoryContainerConfig = {
  icon: Phaser.GameObjects.Image;
  quantityText: Phaser.GameObjects.Text | undefined;
};

export class InventoryIconContainer {
  private inventoryIcons: (InventoryContainerConfig | null)[] = [null, null, null, null];

  constructor(private scene: Phaser.Scene) {}

  public setIcon(index: number, key: string, quantity: number): void {
    this.removeIcon(index);

    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    const posX =
      INVENTORY_SLOTS.START_X + index * (INVENTORY_SLOTS.WIDTH + INVENTORY_SLOTS.PADDING);
    const icon = this.scene.add.image(posX, INVENTORY_SLOTS.Y, key).setOrigin(0, 0.5);
    icon.setDisplaySize(INVENTORY_SLOTS.WIDTH, INVENTORY_SLOTS.HEIGHT);
    icon.name = key;

    const quantityText = this.scene.add.text(
      posX + 13,
      INVENTORY_SLOTS.Y + 3,
      quantity.toString(),
      {
        fontSize: '12px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
      }
    );

    this.inventoryIcons[index] = { icon, quantityText };

    // Feature here
    icon
      .setInteractive({ useHandCursor: true, draggable: true })
      .setData('index', index)
      .setData('key', key);

    // Drag start
    icon.on('dragstart', (_: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'grab';
      quantityText.setVisible(false);
    });
    icon.on('dragstart', ui.hideTooltip, ui);

    // Dragging
    icon.on('drag', (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      this.scene.game.canvas.style.cursor = 'grabbing';
      icon.x = dragX;
      icon.y = dragY;
    });

    // Drag end
    icon.on('dragend', (pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'default';
      quantityText.setVisible(true);

      const dropIndex = this.getSlotIndexAt(pointer.x, pointer.y);
      const fromIndex = icon.getData('index');

      if (dropIndex !== null && dropIndex !== fromIndex) {
        this.handleSwap(fromIndex, dropIndex);
      } else {
        this.handleDestroy(fromIndex);
      }
    });

    // Pointer over
    icon.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'help';
      const keyItem = icon.getData('key');
      const tooltipArray = Object.values(ITEM_TOOLTIPS).map(
        ({ id, title, prop_1, prop_2, prop_3, prop_4 }) => ({
          id,
          title,
          prop_1,
          prop_2,
          prop_3,
          prop_4,
        })
      );

      const info = tooltipArray.find((tooltip) => keyItem === tooltip.id);
      if (!info) return;
      ui.showVerticalTooltip(
        {
          x: icon.x - 10,
          y: icon.y - 30,
          width: 300,
          fillColor: 0x000000,
        },
        info
      );
    });

    // Ponter out
    icon.on('pointerout', ui.hideTooltip, ui);
  }

  public updateQuantity(index: number, quantity: number): void {
    const entry = this.inventoryIcons[index];
    if (entry && entry.quantityText) {
      entry.quantityText.setText(quantity.toString());
    }
  }

  public removeIcon(index: number): void {
    const entry = this.inventoryIcons[index];
    if (!entry) return;

    entry.icon.destroy();
    entry.quantityText?.destroy();

    this.inventoryIcons[index] = null;
  }

  private getSlotIndexAt(x: number, y: number): number | null {
    for (let i = 0; i < 4; i++) {
      const slotX = INVENTORY_SLOTS.START_X + i * (INVENTORY_SLOTS.WIDTH + INVENTORY_SLOTS.PADDING);
      const slotY = INVENTORY_SLOTS.Y;

      if (
        x >= slotX &&
        x <= slotX + INVENTORY_SLOTS.WIDTH &&
        y >= slotY - INVENTORY_SLOTS.HEIGHT / 2 &&
        y <= slotY + INVENTORY_SLOTS.HEIGHT / 2
      ) {
        return i;
      }
    }
    return null;
  }

  private handleSwap(fromIndex: number, toIndex: number): void {
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const items = inventory.getItems();

    const temp = items[fromIndex];
    items[fromIndex] = items[toIndex];
    items[toIndex] = temp;

    inventory.setItems(items);
  }

  private handleDestroy(fromIndex: number): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const items = inventory.getItems();

    const dialog = ui.addWarningDialog('Do you want to destroy this item?');

    dialog.once('confirm', () => {
      items[fromIndex] = null;

      this.removeIcon(fromIndex);
      inventory.setItems(items);
    });

    dialog.once('cancel', () => {
      ui.updateInventory(items);
    });
  }

  private findInventoryrIcon(key: string): InventoryContainerConfig | null | undefined {
    return this.inventoryIcons.find((elem) => elem?.icon.name === key);
  }
}
