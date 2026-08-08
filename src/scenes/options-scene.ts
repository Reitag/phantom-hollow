import { BaseScene } from '@/base/scene/base-scene';
import { Dialog } from '@/components/ui/dialog/dialog';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';
import { MainMenuScene } from './main-menu';

export class OptionsScene extends BaseScene {
  private parentScene: MainMenuScene | null = null;
  private showDeleteBtn: boolean = true;
  private fromPause: boolean = false;

  constructor() {
    super('OptionsScene');
  }

  public init(data?: { showDeleteBtn?: boolean; fromPause?: boolean }): void {
    super.init();
    if (data && data.showDeleteBtn !== undefined) {
      this.showDeleteBtn = data.showDeleteBtn;
    }

    if (data && data.fromPause !== undefined) {
      this.fromPause = data.fromPause;
    }
  }

  public create(): void {
    super.create();

    const { width, height } = this.scale;

    if (this.fromPause) {
      this.backgroundArt?.destroy();
      this.backgroundArt = null;
      this.gameVersion?.destroy();
      this.gameVersion = null;

      this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
    }

    this.parentScene = this.scene.get('MainMenuScene') as MainMenuScene;

    this.scene.bringToTop();

    const centerX = this.menuX;
    let currentY = this.menuStartY;

    this.createAudioControls(centerX, currentY);

    if (this.showDeleteBtn && SaveService.hasSave()) {
      currentY += this.buttonHeight + this.menuGap * 3;

      const deleteBtn = this.createButton(centerX, currentY, {
        key: UI.MISC_UI_DLT_SAVE_DATA_BTN,
        action: () => {
          deleteBtn.disableInteractive();

          const dialog = new Dialog(this);
          dialog.setWarningDialog('Are you sure you want to delete progress?');

          dialog.once('confirm', () => {
            SaveService.clear(true);
            deleteBtn.destroy();
            this.buttons = this.buttons.filter((btn) => btn !== deleteBtn);
          });

          dialog.once('cancel', () => {
            deleteBtn.setInteractive();
          });
        },
      });

      this.buttons.push(deleteBtn);
    }

    //currentY += this.buttonHeight + this.menuGap;

    const backBtn = this.createButton(centerX, this.backY, {
      key: UI.MISC_UI_BACK_BTN,
      action: () => {
        this.closeOptions();
      },
    });

    this.buttons.push(backBtn);
  }

  private createAudioControls(x: number, y: number): void {
    let currentVolumePct = Math.round(this.sound.volume * 100);

    this.add
      .text(x, y - 40, 'SFX Volume', {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    const minusBtn = this.createButton(x - 60, y, {
      key: UI.MISC_UI_MINUS_BTN,
      action: () => {
        updateVolume(currentVolumePct - 10);
      },
    });
    this.buttons.push(minusBtn);

    const volumeText = this.add
      .text(x, y, `${currentVolumePct}%`, {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    const plusBtn = this.createButton(x + 60, y, {
      key: UI.MISC_UI_PLUS_BTN,
      action: () => {
        updateVolume(currentVolumePct + 10);
      },
    });
    this.buttons.push(plusBtn);

    const updateVolume = (newPercent: number) => {
      currentVolumePct = Phaser.Math.Clamp(newPercent, 0, 100);
      volumeText.setText(`${currentVolumePct}%`);

      const phaserVolume = currentVolumePct / 100;
      this.sound.setVolume(phaserVolume);
    };
  }

  private closeOptions(): void {
    if (this.scene.get('MainMenuScene')) {
      this.scene.wake('MainMenuScene');
    }
    if (this.scene.get('PauseScene')) {
      this.scene.wake('PauseScene');
    }

    if (this.parentScene && typeof this.parentScene.refreshMenu === 'function') {
      this.parentScene.refreshMenu();
    }

    this.scene.stop();
  }
}
