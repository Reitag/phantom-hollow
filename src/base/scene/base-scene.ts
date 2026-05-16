import { BUTTON_HOVERS } from '@/constants/button-hovers';

export abstract class BaseScene extends Phaser.Scene {
  protected hoverEffect: Phaser.GameObjects.Graphics | null = null;

  constructor(key: string) {
    super(key);
  }

  public init() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  protected createButton(x: number, y: number, config: { key: string; action: () => void }) {
    const button = this.add
      .image(x, y, config.key)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => this.drawHover(button, BUTTON_HOVERS.POINTEROVER));
    button.on('pointerdown', () => this.drawHover(button, BUTTON_HOVERS.POINTERDOWN));
    button.on('pointerout', () => this.removeHoverEffect());
    button.on('pointerup', () => {
      this.removeHoverEffect();
      config.action();
    });

    return button;
  }

  private drawHover(button: Phaser.GameObjects.Image, style: { COLOR: number; ALPHA: number }) {
    this.removeHoverEffect();

    const x = button.x - button.displayWidth / 2;
    const y = button.y - button.displayHeight / 2;

    this.hoverEffect = this.add.graphics();
    this.hoverEffect.fillStyle(style.COLOR, style.ALPHA);
    this.hoverEffect.fillRoundedRect(x, y, button.displayWidth, button.displayHeight, 4);

    // this.hoverEffect.setDepth(button.depth - 1);
  }

  protected abstract cleanup(): void;

  protected removeHoverEffect(): void {
    if (this.hoverEffect) {
      this.hoverEffect.destroy();
      this.hoverEffect = null;
    }
  }
}
