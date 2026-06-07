import { Panel, PanelConfig } from '@/base/ui/panel';
import { UI } from '@/constants/asset-keys';

export class ControlPanel extends Panel {
  constructor({ scene, slotOffSet, cell }: PanelConfig) {
    super({
      scene: scene,
      slotOffSet: slotOffSet,
      cell: cell,
    });
    const controlTextureKeys = [UI.GEAR_CONTROL, UI.CLOUD_CONTROL, UI.TROPHY_CONTROL];

    for (let i = 0; i < this.slots.length; i++) {
      if (!controlTextureKeys[i]) break;

      const pos = this.getCellPosition(i);

      const iconImage = scene.add
        .image(pos.x + 6, pos.y + 6, controlTextureKeys[i])
        .setOrigin(0, 0)
        .setDepth(this.ICON_DEPTH);

      this.slots[i].icon = iconImage;

      this.clickBinder.bind(iconImage);

      this.setupControlBehavior(i, iconImage);
    }
  }

  protected emitSlotRelease(i: number): void {}
  protected triggerTooltip(index: number): void {}

  private setupControlBehavior(index: number, icon: Phaser.GameObjects.Image): void {
    icon.setInteractive({ useHandCursor: true });

    icon.on('pointerdown', () => this.clickContext.onPress(index));
    icon.on('pointerover', () => this.clickContext.onHover?.(index));
    icon.on('pointerout', () => this.clickContext.onHoverOut?.());

    icon.on('pointerup', () => {
      this.clickContext.onRelease(index);

      switch (index) {
        case 0:
          this.handlePauseBtn();
          break;
        case 1:
          this.handleHelpBtn();
          break;
        case 2:
          this.handleQuestsBtn();
          break;
      }
    });
  }

  private handlePauseBtn(): void {
    this.scene.input.setDefaultCursor('default');
    this.scene.scene.launch('PauseScene').bringToTop('PauseScene');
  }

  private handleHelpBtn(): void {
    console.log('Cloud has been opened');
  }

  private handleQuestsBtn(): void {
    console.log('Trophey has been opened');
  }
}
