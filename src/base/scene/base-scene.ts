import { MISC, UI } from '@/constants/asset-keys';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { Z_POSITION } from '@/constants/z-position';

export abstract class BaseScene extends Phaser.Scene {
  protected buttons: Phaser.GameObjects.Image[] = [];
  protected hoverEffect: Phaser.GameObjects.Graphics | null = null;
  protected gameTitle: Phaser.GameObjects.Image | null = null;
  protected backgroundArt: Phaser.GameObjects.Image | null = null;
  protected gameVersion: Phaser.GameObjects.Text | null = null;

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
    const { key } = this.scene;

    const hideTitle = ['LevelOneScene', 'IntroScene', 'CreditsScene'];
    const hideArt = ['LevelOneScene', 'IntroScene', 'UiScene', 'PauseScene'];
    const hideVersion = ['LevelOneScene', 'IntroScene', 'UiScene', 'PauseScene'];

    if (!hideTitle.includes(key)) this.createGameTitle();
    if (!hideArt.includes(key)) this.createBackgroundArt();
    if (!hideVersion.includes(key)) this.createVersion();
  }

  // Title
  protected createGameTitle(): void {
    const x = this.scale.width / 2;
    const y = 150;

    this.gameTitle = this.add
      .image(x, y, MISC.GAME_TITLE)
      .setOrigin(0.5)
      .setDepth(Z_POSITION.GAME_TITLE);
  }

  // Background art
  protected createBackgroundArt(): void {
    this.backgroundArt = this.add
      .image(this.scale.width / 2, this.scale.height / 2, MISC.MAIN_ART)
      .setOrigin(0.5)
      .setDepth(-1);
  }

  // Version
  protected createVersion(): void {
    const footerY = this.scale.height - 28;

    this.gameVersion = this.add
      .text(28, footerY, `v${this.game.config.gameVersion}`, {
        fontFamily: 'Volkhov',
        fontSize: '13px',
        color: '#6f6f6f',
      })
      .setOrigin(0, 1);
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

    this.gameTitle?.destroy();
    this.gameTitle = null;
    this.backgroundArt?.destroy();
    this.backgroundArt = null;
    this.gameVersion?.destroy();
    this.gameVersion = null;
  }
}
