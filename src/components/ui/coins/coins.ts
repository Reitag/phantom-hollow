import { COIN_UI } from '@/constants/ui-coordinates';

export class Coins {
  private count = 0;
  private textObject: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    this.textObject = this.scene.add
      .text(COIN_UI.COUNT_X, COIN_UI.COUNT_Y, this.count.toString(), {
        font: '16px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0, 0.5);
  }

  public increaseCoins(value: number): void {
    this.count += value;
    this.updateText();
  }

  public decreaseCoins(value: number): void {
    this.count = Math.max(0, this.count - value);
    this.updateText();
  }

  private updateText(): void {
    this.textObject.setText(this.count.toString());
  }
}
