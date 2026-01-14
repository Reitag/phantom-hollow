import { Cell } from '@/base/ui/cell';
import { ITEM_TOOLTIPS } from '@/constants/tooltip-params';
import { ICON_SIZE } from '@/constants/ui';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

type InventoryContainerConfig = {
  icon: Phaser.GameObjects.Image;
  quantityText: Phaser.GameObjects.Text | undefined;
};

export class InventoryIconContainer extends Cell {
  private readonly depthGap = 100;
  private inventoryIcons: (InventoryContainerConfig | null)[] = Array(this.cells.length).fill(null);

  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public get iconContainer(): Phaser.GameObjects.Image[] {
    const arrIcon = [];
    for (const inventory of this.inventoryIcons) {
      if (inventory) {
        arrIcon.push(inventory.icon);
      }
    }
    return arrIcon;
  }

  public setIcon(index: number, key: string, quantity: number): void {
    this.removeIcon(index);

    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

    const slotPos = {
      x: this.getCellPosition(index).x,
      y: this.getCellPosition(index).y,
    };

    const icon = this.scene.add
      .image(slotPos.x, slotPos.y, key)
      .setOrigin(0, 0)
      .setDisplaySize(ICON_SIZE, ICON_SIZE)
      .setDepth(10);

    const quantityText = this.scene.add
      .text(slotPos.x + 13, slotPos.y - 13, quantity.toString(), {
        fontSize: '12px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setDepth(11);

    icon
      .setInteractive({ useHandCursor: true, draggable: true })
      .setData('index', index)
      .setData('key', key);

    this.inventoryIcons[index] = { icon, quantityText };

    icon.on('dragstart', () => {
      this.scene.game.canvas.style.cursor = 'grab';
      quantityText.setVisible(false);
      icon.setDepth(icon.depth + this.depthGap);
    });

    icon.on('dragstart', ui.hideTooltip, ui);

    icon.on('drag', (_: Phaser.Input.Pointer, x: number, y: number) => {
      icon.x = x;
      icon.y = y;
    });

    icon.on('dragend', (pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'default';
      quantityText.setVisible(true);

      const dropIndex = this.getIndex({ x: pointer.x, y: pointer.y });
      const fromIndex = icon.getData('index');

      if (dropIndex !== -1 && dropIndex !== fromIndex) {
        inventory.swapSlots(fromIndex, dropIndex);

        icon.x = slotPos.x;
        icon.y = slotPos.y;
        icon.setDepth(icon.depth - this.depthGap);
      }
      if (dropIndex === -1) {
        const dialog = ui.addWarningDialog('Do you want to destroy this item?');

        dialog.once('confirm', () => {
          inventory.destroySlot(fromIndex);
        });

        dialog.once('cancel', () => {
          inventory.updateUI();
        });
      }
    });

    /*icon.on('pointerover', () => {
      const keyItem = icon.getData('key');
      const info = Object.values(ITEM_TOOLTIPS).find((tooltip) => tooltip.id === keyItem);
      if (!info) return;

      ui.showVerticalTooltip(
        {
          x: icon.x - 220,
          y: icon.y + 20,
          width: 200,
          fillColor: 0x000000,
        },
        info
      );
    });*/

    icon.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer().getDead()) return;

      const pos = { x: pointer.x, y: pointer.y };
      const index = this.getIndex(pos);
      inventory.useSlot(index);
    });

    //icon.on('pointerout', ui.hideTooltip, ui);
  }

  public removeIcon(index: number): void {
    const entry = this.inventoryIcons[index];
    if (!entry) return;

    entry.icon.destroy();
    entry.quantityText?.destroy();
    this.inventoryIcons[index] = null;
  }
}
