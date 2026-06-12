import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { MainMenuScene } from './main-menu';

export class CreditsScene extends BaseScene {
  private parentScene: MainMenuScene | null = null;

  constructor() {
    super('CreditsScene');
  }

  public create(): void {
    this.parentScene = this.scene.get('MainMenuScene') as MainMenuScene;

    const centerX = this.menuX;
    let currentY = this.scale.height / 3;

    const teamText =
      `Design & Code - Ilya Chernov\n` + `Narrative - Artem Sedov\n` + `Art - Darya "InkMoon"`;

    this.add
      .text(centerX, currentY, teamText, {
        fontFamily: 'Volkhov',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0.5);

    currentY += 50;
    this.add
      .graphics()
      .lineStyle(1, 0xffffffff, 0.15)
      .lineBetween(centerX - 100, currentY, centerX + 100, currentY);

    currentY += 40;
    const assetsText = `Audio - Kenney.nl\n` + `Additional Assets - Itch.io Creators`;

    this.add
      .text(centerX, currentY, assetsText, {
        fontFamily: 'Volkhov',
        fontSize: '14px',
        color: '#dddddd',
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0.5);

    currentY += 50;
    this.add
      .graphics()
      .lineStyle(1, 0xffffffff, 0.15)
      .lineBetween(centerX - 60, currentY, centerX + 60, currentY);

    currentY += 40;
    this.add
      .text(centerX, currentY, `Built with Phaser v${Phaser.VERSION}`, {
        fontFamily: 'Volkhov',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0.4);

    currentY += 70;
    const backBtn = this.createButton(centerX, 550, {
      key: UI.MISC_UI_BACK_BTN,
      action: () => {
        this.closeOptions();
      },
    });

    this.buttons.push(backBtn);
  }

  private closeOptions(): void {
    this.scene.wake('MainMenuScene');
    this.parentScene?.refreshMenu();
    this.scene.stop();
  }
}
