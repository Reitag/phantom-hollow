export class OutroScene extends Phaser.Scene {
  private storyText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;

  constructor() {
    super('OutroScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    const content = 'Thanks for playing';

    this.storyText = this.add
      .text(width / 2, height / 2, content, {
        fontSize: '22px',
        fontFamily: 'Volkhov',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 4);

    this.continueButton = this.add
      .text(width / 2, height - 40, 'Back to main menu', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#222222',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.continueButton.on('pointerover', () => {
      this.continueButton.setStyle({ backgroundColor: '#444444' });
    });

    this.continueButton.on('pointerout', () => {
      this.continueButton.setStyle({ backgroundColor: '#222222' });
    });

    this.continueButton.on('pointerdown', () => {
      this.enterToMainMenu();
    });
  }

  private enterToMainMenu(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);

    this.time.delayedCall(800, () => {
      this.continueButton.removeAllListeners();
      this.continueButton.destroy();

      this.scene.start('MainMenuScene');
    });
  }
}
