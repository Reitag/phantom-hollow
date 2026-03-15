export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    const start = this.add
      .text(400, 300, 'Start Game', {
        fontSize: '32px',
        color: '#000000',
      })
      .setInteractive()
      .on('pointerover', () => start.setColor('#333333'))
      .on('pointerout', () => start.setColor('#000000'))
      .on('pointerdown', () => {
        this.scene.stop('MainMenuScene');
        this.scene.start('LevelOneScene');
      });

    const continueBtn = this.add.text(400, 350, 'Continue', {
      fontSize: '32px',
      color: '#000000',
    });
  }
}
