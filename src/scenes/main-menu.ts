import { BaseScene } from '@/base/scene/base-scene';
import { Dialog } from '@/components/ui/dialog/dialog';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';

export class MainMenuScene extends BaseScene {
  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    super.create();

    this.cameras.main.setBackgroundColor('#000000');

    const save = SaveService.load();
    const hasSave = SaveService.hasSave();

    const centerX = this.menuX;

    const buttons = [
      {
        key: UI.MENU_UI_CONTINUE_BTN,
        action: () => {
          if (!save) return;
          this.scene.start(save.scene, save);
        },
        visible: hasSave,
      },
      {
        key: UI.MENU_UI_START_BTN,
        action: () => {
          if (hasSave) {
            this.buttons.forEach((button) => {
              button.disableInteractive();
            });

            const dialog = new Dialog(this);
            dialog.setWarningDialog('Starting a new game overwrites your current save. Continue?');

            dialog.once('confirm', () => {
              SaveService.clear(true);
              this.scene.start('IntroScene');
            });

            dialog.once('cancel', () => {
              this.buttons.forEach((button) => {
                button.setInteractive();
              });
            });
          } else {
            this.scene.start('IntroScene');
          }
        },
        visible: true,
      },
      {
        key: UI.MENU_UI_OPTION_BTN,
        action: () => {
          this.scene.launch('OptionsScene', { showDeleteBtn: true, fromPause: false });
          this.scene.sleep();
        },
        visible: true,
      },
      {
        key: UI.MENU_UI_CREDITS_BTN,
        action: () => {
          this.scene.launch('CreditsScene');
          this.scene.sleep();
        },
        visible: true,
      },
    ];

    buttons.forEach((btn, index) => {
      if (!btn.visible) return;

      const y = this.menuStartY + index * (this.buttonHeight + this.menuGap);

      const button = this.createButton(centerX, y, {
        key: btn.key,
        action: btn.action,
      });

      this.buttons.push(button);
    });

    const footerY = this.scale.height - 28;

    // Version
    this.add
      .text(28, footerY, `v${this.game.config.gameVersion}`, {
        fontFamily: 'Volkhov',
        fontSize: '13px',
        color: '#6f6f6f',
      })
      .setOrigin(0, 1);
  }

  public refreshMenu(): void {
    this.scene.restart();
  }
}
