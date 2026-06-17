import { MISC, UI } from '@/constants/asset-keys';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { Z_POSITION } from '@/constants/z-position';

export abstract class BaseScene extends Phaser.Scene {
  protected buttons: Phaser.GameObjects.Image[] = [];
  protected hoverEffect: Phaser.GameObjects.Graphics | null = null;
  protected gameTitleText: Phaser.GameObjects.Image | null = null;

  constructor(key: string) {
    super(key);
  }

  public init(): void {
    // Cursor
    if (this.textures && this.textures.exists(UI.CURSOR)) {
      const base64Cursor = this.textures.getBase64(UI.CURSOR);
      this.input.setDefaultCursor(`url(${base64Cursor}), default`);
    }

    this.events.once('shutdown', () => {
      this.cleanup();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public create(...args: any[]): void {
    if (this.scene.key !== 'LevelOneScene' && this.scene.key !== 'IntroScene') {
      this.createGameTitle();
    }
  }

  protected createGameTitle(): void {
    const x = this.scale.width / 2;
    const y = 150;

    this.gameTitleText = this.add
      .image(x, y, MISC.GAME_TITLE)
      .setOrigin(0.5)
      .setDepth(Z_POSITION.GAME_TITLE);
  }

  protected get menuX(): number {
    return this.scale.width / 2;
  }

  protected get menuStartY(): number {
    return 400;
  }

  protected get menuGap(): number {
    return 20;
  }

  protected get buttonHeight(): number {
    return 23;
  }

  protected get backY(): number {
    return 540;
  }

  protected createButton(x: number, y: number, config: { key: string; action: () => void }) {
    const button = this.add.image(x, y, config.key).setOrigin(0.5).setInteractive();

    const handlers = {
      over: () => this.drawHover(button, BUTTON_HOVERS.POINTEROVER),
      down: () => this.drawHover(button, BUTTON_HOVERS.POINTERDOWN),
      out: () => this.removeHoverEffect(),
      up: () => {
        this.removeHoverEffect();
        config.action();
      },
    };

    button.setData('hoverHandlers', handlers);

    button.on('pointerover', handlers.over);
    button.on('pointerdown', handlers.down);
    button.on('pointerout', handlers.out);
    button.on('pointerup', handlers.up);

    return button;
  }

  protected removeButtonListeners(button: Phaser.GameObjects.Image): void {
    const handlers = button.getData('hoverHandlers');
    if (!handlers) return;

    button.off('pointerover', handlers.over);
    button.off('pointerdown', handlers.down);
    button.off('pointerout', handlers.out);
    button.off('pointerup', handlers.up);
  }

  private drawHover(button: Phaser.GameObjects.Image, style: { COLOR: number; ALPHA: number }) {
    this.removeHoverEffect();

    const topLeft = button.getTopLeft();

    this.hoverEffect = this.add.graphics();
    this.hoverEffect.fillStyle(style.COLOR, style.ALPHA);
    this.hoverEffect.fillRoundedRect(
      topLeft.x,
      topLeft.y,
      button.displayWidth,
      button.displayHeight,
      4
    );
  }

  protected removeHoverEffect(): void {
    if (this.hoverEffect) {
      this.hoverEffect.destroy();
      this.hoverEffect = null;
    }
  }

  protected cleanup(): void {
    this.buttons.forEach((button) => {
      this.removeButtonListeners(button);
      button.destroy();
    });
    this.buttons = [];
  }
}
