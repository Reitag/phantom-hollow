import { BaseScene } from '@/base/scene/base-scene';
import { Dialog } from '@/components/ui/dialog/dialog';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';
import { SettingsService } from '@/infrastructure/settings-service';
import { MainMenuScene } from './main-menu';

export class OptionsScene extends BaseScene {
  private parentScene: MainMenuScene | null = null;
  private showDeleteBtn: boolean = true;
  private fromPause: boolean = false;

  private onEnterFullscreen?: () => void;
  private onLeaveFullscreen?: () => void;

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
    const startY = this.menuStartY - 200;
    // Works from Main Menu
    if (this.showDeleteBtn) this.createSoftParchmentGlow(centerX, 285, 740, 520);

    this.createAudioControls(centerX, startY);
    this.createDisplayControls(centerX, startY + 180);

    if (this.showDeleteBtn && SaveService.hasSave()) {
      const deleteBtnY = startY + 280;

      const deleteBtn = this.createButton(centerX, deleteBtnY, {
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

    const color = this.fromPause ? '#ffffff' : '#030303';

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

    const minusMusicBtn = this.createButton(x - 60, y + 35, {
      key: UI.MISC_UI_MINUS_BTN,
      action: () => {
        updateMusicVolume(currentMusicVolume - 10);
      },
    });
    this.buttons.push(minusMusicBtn);

    const musicVolumeText = this.add
      .text(x, y + 35, `${currentMusicVolume}%`, {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const plusMusicBtn = this.createButton(x + 60, y + 35, {
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
      .text(x, y + 90, 'SFX Volume', {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const minusSfxBtn = this.createButton(x - 60, y + 125, {
      key: UI.MISC_UI_MINUS_BTN,
      action: () => {
        updateSFXVolume(currentSFXVolume - 10);
      },
    });
    this.buttons.push(minusSfxBtn);

    const sfxVolumeText = this.add
      .text(x, y + 125, `${currentSFXVolume}%`, {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const plusSfxBtn = this.createButton(x + 60, y + 125, {
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

  private createDisplayControls(x: number, y: number): void {
    const color = this.fromPause ? '#ffffff' : '#030303';

    this.add
      .text(x, y, 'Fullscreen', {
        fontFamily: 'Volkhov',
        fontSize: '16px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const isElectron = Boolean(window.electronAPI);
    let currentFullscreen = isElectron ? SettingsService.data.fullscreen : this.scale.isFullscreen;

    const toggleBtn = this.createButton(x, y + 35, {
      key: currentFullscreen ? UI.MISC_ON_BTN : UI.MISC_OFF_BTN,
      action: () => {
        if (window.electronAPI) {
          currentFullscreen = !currentFullscreen;
          window.electronAPI.setFullscreen(currentFullscreen);
          SettingsService.patch({ fullscreen: currentFullscreen });
          toggleBtn.setTexture(currentFullscreen ? UI.MISC_ON_BTN : UI.MISC_OFF_BTN);
        } else {
          if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
            SettingsService.patch({ fullscreen: false });
          } else {
            this.scale.startFullscreen();
            SettingsService.patch({ fullscreen: true });
          }
        }
      },
    });
    this.buttons.push(toggleBtn);

    if (window.electronAPI) {
      window.electronAPI.getFullscreen().then((realState) => {
        currentFullscreen = realState;
        if (toggleBtn.active) {
          toggleBtn.setTexture(realState ? UI.MISC_ON_BTN : UI.MISC_OFF_BTN);
        }
      });
    } else {
      this.onEnterFullscreen = () => {
        toggleBtn.setTexture(UI.MISC_ON_BTN);
      };

      this.onLeaveFullscreen = () => {
        toggleBtn.setTexture(UI.MISC_OFF_BTN);
      };

      this.scale.on('enterfullscreen', this.onEnterFullscreen);
      this.scale.on('leavefullscreen', this.onLeaveFullscreen);
    }
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

  protected override cleanup(): void {
    if (this.onEnterFullscreen) {
      this.scale.off('enterfullscreen', this.onEnterFullscreen);
      this.onEnterFullscreen = undefined;
    }

    if (this.onLeaveFullscreen) {
      this.scale.off('leavefullscreen', this.onLeaveFullscreen);
      this.onLeaveFullscreen = undefined;
    }

    super.cleanup();
  }
}
