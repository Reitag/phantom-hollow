import { UI } from '@/constants/asset-keys';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { WARNING_BOX } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';

export class Dialog extends Phaser.Events.EventEmitter {
  private hoverGraphics: Phaser.GameObjects.Graphics | null = null;
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

    const msg = this.scene.add.text(-86, -35, text, {
      font: '12px Arial',
      color: '#151515',
      stroke: '#dddddd',
      //color: '#dddddd',
      //stroke: '#151515',
      strokeThickness: 1,
      align: 'left',
      wordWrap: {
        width: 220,
      },
    });
    this.warningDialog.add(msg);

    const buttonsOffsetY = WARNING_BOX.BUTTON_OFFSET_Y;
    const buttonsSpacing = WARNING_BOX.BUTTONS_SPACING;

    const yesX = -buttonsSpacing / 2 + 30;
    const noX = buttonsSpacing / 2 + 30;

    this.yesButton = this.scene.add
      .image(yesX, buttonsOffsetY, UI.DIALOG_UI_BUTTON_YES)
      .setInteractive();

    this.noButton = this.scene.add
      .image(noX, buttonsOffsetY, UI.DIALOG_UI_BUTTON_NO)
      .setInteractive();

    this.yesButton.setData('startY', buttonsOffsetY);
    this.noButton.setData('startY', buttonsOffsetY);

    this.warningDialog.add(this.yesButton);
    this.warningDialog.add(this.noButton);

    this.attachButtonEvents(this.yesButton, 'confirm');
    this.attachButtonEvents(this.noButton, 'cancel');
  }

  public destroy(): void {
    this.close();
    super.destroy();
  }

  private attachButtonEvents(btn: Phaser.GameObjects.Image, eventName: 'confirm' | 'cancel'): void {
    const onOver = () => this.handleButtonOver(btn);
    const onOut = () => this.handleButtonOut(btn);
    const onDown = () => this.handleButtonDown(btn);
    const onUp = () => this.handleButtonUp(btn, eventName);

    btn.on('pointerover', onOver);
    btn.on('pointerout', onOut);
    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);

    btn.setData('events', { onOver, onOut, onDown, onUp });
  }

  private detachButtonEvents(btn: Phaser.GameObjects.Image): void {
    const handlers = btn.getData('events');
    if (!handlers) return;

    btn.off('pointerover', handlers.onOver);
    btn.off('pointerout', handlers.onOut);
    btn.off('pointerdown', handlers.onDown);
    btn.off('pointerup', handlers.onUp);
  }

  private handleButtonOver(target: Phaser.GameObjects.Image): void {
    if (this.hoverGraphics) this.hoverGraphics.destroy();

    const hoverColor = BUTTON_HOVERS.POINTEROVER.COLOR;
    const hoverAlpha = BUTTON_HOVERS.POINTEROVER.ALPHA;
    const cornerRadius = 6;

    const rectX = target.x - target.width / 2;
    const rectY = target.y - target.height / 2;

    this.hoverGraphics = this.scene.add
      .graphics()
      .fillStyle(hoverColor, hoverAlpha)
      .fillRoundedRect(rectX, rectY, target.width, target.height, cornerRadius)
      .setDepth(Z_POSITION.UI + 30);

    this.warningDialog.add(this.hoverGraphics);
  }

  private handleButtonOut(target: Phaser.GameObjects.Image): void {
    if (this.hoverGraphics) {
      this.hoverGraphics.destroy();
      this.hoverGraphics = null;
    }
  }

  private handleButtonDown(target: Phaser.GameObjects.Image): void {
    if (this.hoverGraphics) {
      const startY = target.getData('startY');

      const hoverColor = BUTTON_HOVERS.POINTERDOWN.COLOR;
      const hoverAlpha = BUTTON_HOVERS.POINTERDOWN.ALPHA;
      const cornerRadius = 6;

      this.hoverGraphics.clear();
      this.hoverGraphics.fillStyle(hoverColor, hoverAlpha);

      const rectX = target.x - target.width / 2;
      const rectY = startY + 2 - target.height / 2;

      this.hoverGraphics.fillRoundedRect(rectX, rectY, target.width, target.height, cornerRadius);
    }
  }

  private handleButtonUp(target: Phaser.GameObjects.Image, eventName: string): void {
    if (this.hoverGraphics) {
      this.warningDialog.remove(this.hoverGraphics);
      this.hoverGraphics.destroy();
      this.hoverGraphics = null;
    }

    this.emit(eventName);
    this.close();
  }

  private close(): void {
    this.detachButtonEvents(this.yesButton);
    this.detachButtonEvents(this.noButton);
    this.warningDialog.destroy(true);
  }
}
