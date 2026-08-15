import { BaseScene } from '@/base/scene/base-scene';
import { MISC, UI } from '@/constants/asset-keys';
import { MainMenuScene } from './main-menu';

export class CreditsScene extends BaseScene {
  private parentScene: MainMenuScene | null = null;
  private phaserLogo: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('CreditsScene');
  }

  public create(): void {
    super.create();

    this.parentScene = this.scene.get('MainMenuScene') as MainMenuScene;

    /*if (this.gameTitleText) {
      this.gameTitleText.setVisible(false);
    }*/

    const centerX = this.menuX;

    let currentY = 75;

    const teamText =
      `GAME DESIGN & PROGRAMMING\n` +
      `Ilya "Reitag" Chernov\n\n` +
      `CO-FUNDING, NARRATIVE & QA\n` +
      `Artem "sacrificengineer" Sedov\n\n` +
      `CHARACTER ART & ENVIRONMENTS\n` +
      `Darya "InkMoon"`;

    this.add
      .text(centerX, currentY, teamText, {
        fontFamily: 'Volkhov',
        fontSize: '12px',
        color: '#030303',
        align: 'center',
        lineSpacing: 6,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0);

    currentY += 185;

    const thirdParty =
      `THIRD-PARTY ASSETS\n` +
      `Momonga • LuizMelo • Pixfinity • cptfoorman • Anokolisa • Foozle\n` +
      `GandalfHardcore • Ansimuz • Wenrexa • Pixel Explosive • Craftpix\n` +
      `La Red Games • Dusk Games • Pimen • Jz Pixels\n` +
      `Frostwindz • bluecarrot16 & LPC (b_o, Sharm, J. Charlot, Yar,\n` +
      `Jetrel, Zabin, Hyptosis, Surt, KnoblePersona) • Ivan Petrov & Cyreal\n` +
      `freesound_community • Dragon Studio • Yodguard • TomMusic\n` +
      `Daniel SoundsGood • Last Day Dreaming`;

    this.add
      .text(centerX, currentY, thirdParty, {
        fontFamily: 'Volkhov',
        fontSize: '12px',
        color: '#030303',
        align: 'center',
        lineSpacing: 6,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0);

    currentY += 190;

    const madeWithText = this.add
      .text(centerX, currentY, `Made with`, {
        fontFamily: 'Volkhov',
        fontSize: '12px',
        color: '#101010',
        align: 'center',
      })
      .setOrigin(0.5, 0);

    currentY = madeWithText.y + madeWithText.displayHeight + 10;

    this.phaserLogo = this.add
      .image(centerX, currentY, MISC.PHASER_PIXEL_MEDIUM_FLAT)
      .setOrigin(0.5, 0)
      .setAlpha(0.5)
      .setInteractive({ useHandCursor: true });

    this.phaserLogo.on('pointerup', () => {
      const url = 'https://phaser.io';
      window.open(url, '_blank');
    });

    this.phaserLogo.on('pointerover', () => this.phaserLogo?.setAlpha(0.9));
    this.phaserLogo.on('pointerout', () => this.phaserLogo?.setAlpha(0.5));

    this.add
      .text(centerX, this.phaserLogo.y + this.phaserLogo.displayHeight + 6, `v${Phaser.VERSION}`, {
        fontFamily: 'Volkhov',
        fontSize: '11px',
        color: '#101010',
        align: 'center',
      })
      .setOrigin(0.5, 0);

    const backBtn = this.createButton(centerX, 550, {
      key: UI.MISC_UI_BACK_BTN,
      action: () => {
        this.closeOptions();
      },
    });

    this.buttons.push(backBtn);
  }

  private closeOptions(): void {
    this.phaserLogo?.disableInteractive();
    this.phaserLogo?.destroy();
    this.phaserLogo = null;

    this.scene.wake('MainMenuScene');
    this.parentScene?.refreshMenu();
    this.scene.stop();
  }
}
