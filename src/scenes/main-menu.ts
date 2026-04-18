import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';

export class MainMenuScene extends Phaser.Scene {
  private menuButtons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    /*this.add.image(0, 0, BACKGROUNDS.MAIN_SCENE_BG).setOrigin(0);*/
    this.cameras.main.setBackgroundColor('#000000');

    const save = SaveService.load();
    const hasSave = SaveService.hasSave();

    const centerX = this.scale.width / 2;
    const startY = 380;
    const gap = 20;

    // Button config
    const buttons = [
      {
        key: UI.MENU_UI_START_BTN,
        action: () => {
          if (hasSave) {
            SaveService.clear(true);
          }
          this.scene.start('IntroScene');
        },
        visible: true,
      },
      {
        key: UI.MENU_UI_CONTINUE_BTN,
        action: () => {
          if (!save) return;
          this.scene.start(save.scene, save);
        },
        visible: hasSave,
      },
      {
        key: UI.MENU_UI_OPTION_BTN,
        action: () => {
          console.log('Options clicked');
        },
        visible: true,
      },
      {
        key: UI.MENU_UI_CREDITS_BTN,
        action: () => {
          console.log('Credits clicked');
        },
        visible: true,
      },
    ];

    // Render buttons
    let index = 0;

    buttons.forEach((btn) => {
      if (!btn.visible) return;

      const y = startY + index * (23 + gap); // 32(23) is button height

      const button = this.add
        .image(centerX, y, btn.key)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      const onOver = () => {
        button.setTint(0xfce2bd);
      };

      const onOut = () => {
        button.clearTint();
      };

      const onDown = () => {
        button.setTint(0x88ff88);
      };

      const onUp = () => {
        button.clearTint();
        btn.action();
      };

      // attach
      button
        .on('pointerover', onOver)
        .on('pointerout', onOut)
        .on('pointerdown', onDown)
        .on('pointerup', onUp);

      // store reference
      this.menuButtons.push(button);

      index++;
    });

    // Version
    this.add.text(20, 600, 'Version 0.14.0 In development', {
      fontFamily: 'Volkhov',
      fontSize: '16px',
      fontStyle: 'normal',
    });

    // Clean Up
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanup();
    });
  }

  private cleanup(): void {
    this.menuButtons.forEach((button) => {
      button.removeAllListeners();
      button.destroy();
    });

    this.menuButtons = [];
  }
}
