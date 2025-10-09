import { SCENE_SIZE } from '@/constants/scene-size';
import { WARNING_TEXT } from '@/constants/ui-coordinates';

export class Text {
  private textContainer: Phaser.GameObjects.Text[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addWarningTextOnScreen(text: string) {
    const index = this.textContainer.length;
    const posY = WARNING_TEXT.START_Y + index * WARNING_TEXT.PADDING;

    const sceneText = this.scene.add
      .text(SCENE_SIZE.WIDTH / 2, posY, text, {
        font: '22px Arial',
        color: '#d60409',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);
    this.textContainer.push(sceneText);

    this.scene.time.delayedCall(2000, () => {
      this.removeWarningFirstText(sceneText);
    });
  }

  private removeWarningFirstText(text: Phaser.GameObjects.Text) {
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration: 500,
      ease: 'Sine.easeIn',
      onComplete: () => {
        //this.textContainer.shift();
        const index = this.textContainer.indexOf(text);
        if (index !== -1) this.textContainer.splice(index, 1);
        text.destroy();
        this.repositionWarningTexts();
      },
    });
  }

  private repositionWarningTexts(): void {
    this.textContainer.forEach((t, i) => {
      const targetY = WARNING_TEXT.START_Y + i * WARNING_TEXT.PADDING;
      this.scene.tweens.add({
        targets: t,
        y: targetY,
        duration: 50,
        ease: 'Sine.easeInOut',
      });
    });
  }
}
