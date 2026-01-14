import { InputController } from '@/base/input/input-controller';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';
import { ITEM_TOOLTIPS } from '@/constants/tooltip-params';
import { InventoryIconContainer } from '../inventory-icons/inventory-icon-container';

export class HoverTooltip {
  private ui: UiSystem;
  private input: InputController;
  private iconContainer: Phaser.GameObjects.Image[] = [];
  private inventoryIconContainer: InventoryIconContainer;

  constructor() {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.input = ServiceLocator.resolve(ServiceKeys.input);
    this.inventoryIconContainer = this.ui.getIconContainer();
  }

  public update() {
    if (this.input.isUtilityDown) {
      this.enableTooltips();
    } else {
      this.disableTooltips();
    }
  }

  private enableTooltips(): void {
    if (this.iconContainer.length > 0) return;

    this.iconContainer = this.inventoryIconContainer.iconContainer;

    for (const icon of this.iconContainer) {
      //icon.setInteractive({ useHandCursor: true });

      icon.on('pointerover', (pointer: Phaser.Input.Pointer) => {
        this.showTooltip(pointer, icon);
      });

      icon.on('pointerout', () => {
        this.ui.hideTooltip();
      });
    }
  }

  private disableTooltips(): void {
    if (this.iconContainer.length === 0) return;

    for (const icon of this.iconContainer) {
      icon.off('pointerover');
      icon.off('pointerout');
    }

    this.ui.hideTooltip();
    this.iconContainer = [];
  }

  private showTooltip(pointer: Phaser.Input.Pointer, icon: Phaser.GameObjects.Image): void {
    const keyItem = icon.getData('key');
    const info = Object.values(ITEM_TOOLTIPS).find((t) => t.id === keyItem);
    if (!info) return;

    this.ui.showVerticalTooltip(
      {
        x: icon.x - 220,
        y: icon.y - 20,
        width: 280,
        fillColor: 0x000000,
      },
      info
    );
  }
}
