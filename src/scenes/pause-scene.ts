export class PauseScene extends Phaser.Scene {
  private resumeBtn: Phaser.GameObjects.Text | null = null;
  private menuBtn: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('PauseScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    // Pause all scenes
    if (this.scene.isActive('UiScene')) {
      this.scene.pause('UiScene');
    }
    this.scene.pause('LevelOneScene');
    this.sound.pauseAll();

    // Background
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Title
    this.add
      .text(width / 2, height / 2 - 100, 'PAUSED', {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const buttonStyle = {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 },
    };

    // Resume
    this.resumeBtn = this.add
      .text(width / 2, height / 2, 'Resume', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', this.handleResume, this);

    // Menu
    this.menuBtn = this.add
      .text(width / 2, height / 2 + 80, 'Back to Main Menu', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', this.handleBackMainMenu, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private handleResume(): void {
    this.scene.resume('UiScene');
    this.scene.resume('LevelOneScene');
    this.sound.resumeAll();
    this.scene.stop();
  }

  private handleBackMainMenu(): void {
    this.scene.stop('LevelOneScene');
    this.scene.stop('UiScene');
    this.scene.start('MainMenuScene');
  }

  private cleanup(): void {
    this.resumeBtn?.removeAllListeners();
    this.menuBtn?.removeAllListeners();

    this.resumeBtn?.destroy();
    this.menuBtn?.destroy();
  }
}
