import { SaveService } from '@/infrastructure/save-service';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    const save = SaveService.load();

    // Start button
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

    // Continue button
    const continueBtn = this.add.text(400, 350, 'Continue', {
      fontSize: '32px',
    });

    if (save.scene !== undefined) {
      continueBtn
        .setColor('#000000')
        .setInteractive()
        .on('pointerover', () => continueBtn.setColor('#333333'))
        .on('pointerout', () => continueBtn.setColor('#000000'))
        .on('pointerdown', () => {
          if (!save) return;

          this.scene.stop('MainMenuScene');
          this.scene.start(save.scene, save);
        });
    } else {
      continueBtn.setColor('#333333');
    }
  }
}
