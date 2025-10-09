import { INVENTORY_SLOTS } from '@/constants/ui-coordinates';

type InventoryContainerConfig = {
  icon: Phaser.GameObjects.Image;
  quantityText: Phaser.GameObjects.Text | undefined;
};

export class InventoryIconContainer {
  private inventoryIcons: (InventoryContainerConfig | null)[] = [null, null, null, null];

  constructor(private scene: Phaser.Scene) {}

  public setIcon(index: number, key: string, quantity: number): void {
    this.removeIcon(index);

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

  private findInventoryrIcon(key: string): InventoryContainerConfig | null | undefined {
    return this.inventoryIcons.find((elem) => elem?.icon.name === key);
  }
}
