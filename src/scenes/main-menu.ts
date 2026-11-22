import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';

export class MainMenuScene extends BaseScene {
  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    super.create();

    const save = SaveService.load();
    const hasSave = SaveService.hasSave();

    const isElectron = navigator.userAgent.toLowerCase().includes('electron');

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
            this.openConfirmDialog(
              'Starting a new game overwrites your current save. Continue?',
              () => {
                SaveService.clear(true);
                this.scene.start('IntroScene');
              }
            );
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
      {
        key: UI.MENU_UI_QUIT_BTN,
        action: () => {
          window.close();
        },
        visible: isElectron,
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
  }

  public refreshMenu(): void {
    this.scene.restart();
  }
}
