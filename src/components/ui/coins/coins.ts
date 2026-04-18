import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';

export class Coins {
  private count = 0;
  private textObject: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
    const coinCoord = getUiCoords(uiCoords, 'coin-count');

    this.textObject = this.scene.add
      .text(coinCoord.x, coinCoord.y - 3, this.count.toString(), {
        fontFamily: 'Gadget',
        fontSize: '16px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0, 0);
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
