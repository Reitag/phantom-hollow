type InventoryContainerConfig = {
  icon: Phaser.GameObjects.Image;
  quantityText: Phaser.GameObjects.Text | undefined;
};

export class InventoryIconContainer {
  private readonly ICON_WIDTH = 16;
  private readonly ICON_HEIGHT = 24;
  private readonly PADDING = 16;
  private readonly startX = 17;
  private readonly y = 615;

  private inventoryIcons: (InventoryContainerConfig | null)[] = [null, null, null, null];

  constructor(private scene: Phaser.Scene) {}

  /*public addIcon(key: string, quantity?: number): void {
    if (!this.findInventoryrIcon(key)) {
      const index = this.inventoryIcons.length;
      const posX = this.startX + index * (this.ICON_WIDTH + this.PADDING);
      const icon = this.scene.add.image(posX, this.y, key).setOrigin(0, 0.5);
      icon.setDisplaySize(this.ICON_WIDTH, this.ICON_HEIGHT);
      icon.name = key;

      let quantityText: Phaser.GameObjects.Text | undefined;
      if (quantity !== undefined) {
        quantityText = this.scene.add
          .text(posX + 12, this.y + 10, quantity.toString(), {
            fontSize: '12px',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 2,
          })
          .setOrigin(1, 1);
      }
      this.inventoryIcons.push({ icon, quantityText });
    } else {
      const entity = this.findInventoryrIcon(key);
      if (!entity || !quantity) return;

      const { icon, quantityText } = entity;
      quantityText?.setText(quantity?.toString());
    }
  }*/
  public setIcon(index: number, key: string, quantity: number): void {
    // Clear old icon if exists
    this.removeIcon(index);

    const posX = this.startX + index * (this.ICON_WIDTH + this.PADDING);
    const icon = this.scene.add.image(posX, this.y, key).setOrigin(0, 0.5);
    icon.setDisplaySize(this.ICON_WIDTH, this.ICON_HEIGHT);
    icon.name = key;

    const quantityText = this.scene.add
      .text(posX + 13, this.y - 15, quantity.toString(), {
        fontSize: '16px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(1, 1);

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
