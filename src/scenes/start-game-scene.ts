export class StartGameScene extends Phaser.Scene {
  private acceptBtn: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('StartGameScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setInteractive();
    this.add.rectangle(width / 2, height / 2, 520, 320, 0x1e1e1e).setStrokeStyle(2, 0xffffff);

    const content =
      'Hokki Silverfir:\n\n' +
      'Our lands are in peril. My scouts have confirmed that Sacryth the Duskbringer is the one behind this chaos.\n\n' +
      'I beg of you — eliminate the warlock.';

    this.add
      .text(width / 2, height / 2 - 70, content, {
        fontSize: '20px',
        color: '#ffffff',
        align: 'left',
        wordWrap: { width: 480 },
      })
      .setOrigin(0.5);

    this.acceptBtn = this.add
      .text(width / 2, height / 2 + 80, 'ACCEPT', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.acceptBtn.on('pointerdown', this.handleAccept, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private handleAccept(): void {
    //this.scene.resume('LevelOneScene');
    //this.scene.resume('UiScene');
    this.scene.stop();
  }

  private cleanup(): void {
    this.acceptBtn?.removeAllListeners();
    this.acceptBtn?.destroy();
  }
}
