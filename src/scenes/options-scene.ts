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
    let currentY = this.menuStartY - 120;

    this.createAudioControls(centerX, currentY);

    if (this.showDeleteBtn && SaveService.hasSave()) {
      currentY += this.buttonHeight + this.menuGap * 3;

      const deleteBtn = this.createButton(centerX, currentY + 120, {
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

    const backBtn = this.createButton(centerX, this.backY, {
      key: UI.MISC_UI_BACK_BTN,
      action: () => {
        this.closeOptions();
      },
    });

    this.buttons.push(backBtn);
  }

  private createAudioControls(x: number, y: number): void {
    let currentMusicVolume = Math.round(this.game.audioService.musicVolume * 100);
    let currentSFXVolume = Math.round(this.game.audioService.sfxVolume * 100);

    let color = '#030303';
    if (this.fromPause) {
      color = '#ffffff';
    }

    // Music
    this.add
      .text(x, y, 'Music Volume', {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const minusMusicBtn = this.createButton(x - 60, y + 40, {
      key: UI.MISC_UI_MINUS_BTN,
      action: () => {
        updateMusicVolume(currentMusicVolume - 10);
      },
    });
    this.buttons.push(minusMusicBtn);

    const musicVolumeText = this.add
      .text(x, y + 40, `${currentMusicVolume}%`, {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const plusMusicBtn = this.createButton(x + 60, y + 40, {
      key: UI.MISC_UI_PLUS_BTN,
      action: () => {
        updateMusicVolume(currentMusicVolume + 10);
      },
    });
    this.buttons.push(plusMusicBtn);

    const updateMusicVolume = (newPercent: number): void => {
      currentMusicVolume = Phaser.Math.Clamp(newPercent, 0, 100);
      musicVolumeText.setText(`${currentMusicVolume}%`);

      const volume = currentMusicVolume / 100;
      this.game.audioService.music.setVolume(volume);
    };

    // SFX
    this.add
      .text(x, y + 100, 'SFX Volume', {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const minusSfxBtn = this.createButton(x - 60, y + 140, {
      key: UI.MISC_UI_MINUS_BTN,
      action: () => {
        updateSFXVolume(currentSFXVolume - 10);
      },
    });
    this.buttons.push(minusSfxBtn);

    const sfxVolumeText = this.add
      .text(x, y + 140, `${currentSFXVolume}%`, {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const plusSfxBtn = this.createButton(x + 60, y + 140, {
      key: UI.MISC_UI_PLUS_BTN,
      action: () => {
        updateSFXVolume(currentSFXVolume + 10);
      },
    });
    this.buttons.push(plusSfxBtn);

    const updateSFXVolume = (newPercent: number): void => {
      currentSFXVolume = Phaser.Math.Clamp(newPercent, 0, 100);
      sfxVolumeText.setText(`${currentSFXVolume}%`);

      const volume = currentSFXVolume / 100;
      this.game.audioService.sfx.setVolume(volume);
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
