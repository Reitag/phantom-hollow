export class VictoryScene extends Phaser.Scene {
  private continueBtn: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('VictoryScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.scene.pause('LevelOneScene');
    this.scene.pause('UiScene');

    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setInteractive();

    this.add
      .text(width / 2, height / 2 - 60, 'Victory!', {
        fontSize: '40px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, 'Sacryth the Duskbringer has been defeated.', {
        fontSize: '22px',
        color: '#dddddd',
        align: 'center',
        wordWrap: { width: 500 },
      })
      .setOrigin(0.5);

    this.continueBtn = this.add
      .text(width / 2, height / 2 + 100, 'CONTINUE', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.continueBtn.on('pointerdown', this.handleContinue, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private handleContinue(): void {
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      this.scene.stop('LevelOneScene');
      this.scene.stop('UiScene');
      this.scene.stop();
      this.scene.start('OutroScene');
    });
  }

  private cleanup(): void {
    this.continueBtn?.removeAllListeners();
    this.continueBtn?.destroy();
  }
}
