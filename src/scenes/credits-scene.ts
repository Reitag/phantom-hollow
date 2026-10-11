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

    const centerX = this.menuX;

    let currentY = 55;

    const teamText =
      `GAME DIRECTOR & LEAD PROGRAMMER\n` +
      `Ilya "Reitag" Chernov\n\n` +
      `ASSOCIATE PRODUCER, NARRATIVE & QA\n` +
      `Artem "sacrificengineer" Sedov\n\n` +
      `LEAD 2D ARTIST & ILLUSTRATOR\n` +
      `Darya "InkMoon"\n\n` +
      `ORIGINAL SOUNDTRACK COMPOSER\n` +
      `Petr "PetRUalitY" Brabich`;

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

    currentY += 255;

    const thirdParty =
      `THIRD-PARTY ASSETS\n` +
      `Momonga • LuizMelo • Pixfinity • cptfoorman • Anokolisa • Foozle • GandalfHardcore\n` +
      `Ansimuz • Wenrexa • Pixel Explosive • Craftpix • La Red Games • Dusk Games • Pimen\n` +
      `Jz Pixels • Frostwindz • greedy_toad • bluecarrot16 & LPC (b_o, Sharm, J. Charlot, Yar,\n` +
      `Jetrel, Zabin, Hyptosis, Surt, KnoblePersona) • Ivan Petrov & Cyreal • freesound_community\n` +
      `Dragon Studio • Yodguard • Liecio • SoundReality • TomMusic • Daniel SoundsGood • Last Day Dreaming`;

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

    currentY += 135;

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
