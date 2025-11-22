import { UI } from '@/constants/asset-keys';
import { WARNING_BOX } from '@/constants/ui-coordinates';

export class Dialog extends Phaser.Events.EventEmitter {
  private warningDialog!: Phaser.GameObjects.Container;
  private yesButton!: Phaser.GameObjects.Image;
  private noButton!: Phaser.GameObjects.Image;

  constructor(private scene: Phaser.Scene) {
    super();
  }

  public setWarningDialog(text: string): void {
    // Container
    this.warningDialog = this.scene.add.container(WARNING_BOX.BG.X, WARNING_BOX.BG.Y);

    // BG
    const bg = this.scene.add.image(0, 0, UI.DIALOG_UI).setOrigin(0.5, 0.5);
    this.warningDialog.add(bg);

    const msg = this.scene.add
      .text(20, -15, text, {
        font: '12px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);
    this.warningDialog.add(msg);

    // Buttons
    this.yesButton = this.scene.add
      .image(WARNING_BOX.YES_BTN.X, WARNING_BOX.YES_BTN.Y, UI.DIALOG_UI_BUTTON_YES)
      .setInteractive({ useHandCursor: true });

    this.noButton = this.scene.add
      .image(WARNING_BOX.NO_BTN.X, WARNING_BOX.NO_BTN.Y, UI.DIALOG_UI_BUTTON_NO)
      .setInteractive({ useHandCursor: true });

    this.warningDialog.add(this.yesButton);
    this.warningDialog.add(this.noButton);

    this.attachButtonEvents(this.yesButton, 'confirm');
    this.attachButtonEvents(this.noButton, 'cancel');
  }

  private attachButtonEvents(btn: Phaser.GameObjects.Image, eventName: 'confirm' | 'cancel'): void {
    const onOver = () => this.handleButtonOver(btn);
    const onOut = () => this.handleButtonOut(btn);
    const onUp = () => this.handleButtonUp(btn, eventName);

    btn.on('pointerover', onOver);
    btn.on('pointerout', onOut);
    btn.on('pointerup', onUp);

    btn.setData('events', { onOver, onOut, onUp });
  }

  private detachButtonEvents(btn: Phaser.GameObjects.Image): void {
    const handlers = btn.getData('events');
    if (!handlers) return;

    btn.off('pointerover', handlers.onOver);
    btn.off('pointerout', handlers.onOut);
    btn.off('pointerup', handlers.onUp);
  }

  private handleButtonOver(target: Phaser.GameObjects.Image): void {
    target.setScale(1.05, 1.1).setTint(0xffaaaa);
  }

  private handleButtonOut(target: Phaser.GameObjects.Image): void {
    target.setScale(1).clearTint();
  }

  private handleButtonUp(target: Phaser.GameObjects.Image, eventName: string): void {
    target.setScale(1).clearTint();
    this.emit(eventName);
    this.close();
  }

  private close(): void {
    this.detachButtonEvents(this.yesButton);
    this.detachButtonEvents(this.noButton);
    this.warningDialog.destroy(true);
  }
}
