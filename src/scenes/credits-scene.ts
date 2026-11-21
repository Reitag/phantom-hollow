import { BaseScene } from '@/base/scene/base-scene';
import { MISC, UI } from '@/constants/asset-keys';
import { MainMenuScene } from './main-menu';

export class CreditsScene extends BaseScene {
  private parentScene: MainMenuScene | null = null;
  private phaserLogo: Phaser.GameObjects.Image | null = null;

  private readonly handleLogoClick = (): void => {
    window.open('https://phaser.io', '_blank');
  };

  private readonly handleLogoOver = (): void => {
    this.phaserLogo?.setAlpha(0.95);
  };

  private readonly handleLogoOut = (): void => {
    this.phaserLogo?.setAlpha(0.7);
  };

  constructor() {
    super('CreditsScene');
  }

  public create(): void {
    super.create();

    this.parentScene = this.scene.get('MainMenuScene') as MainMenuScene;
    const centerX = Math.round(this.menuX);

    this.createSoftParchmentGlow(centerX, 285, 740, 520);

    const teamStr =
      `GAME DIRECTOR & LEAD PROGRAMMER\n` +
      `Ilya "Reitag" Chernov\n\n` +
      `ASSOCIATE PRODUCER, NARRATIVE & QA\n` +
      `Artem "sacrificengineer" Sedov\n\n` +
      `LEAD 2D ARTIST & ILLUSTRATOR\n` +
      `Darya "InkMoon"\n\n` +
      `ORIGINAL SOUNDTRACK COMPOSER\n` +
      `Petr "PetRUalitY" Brabich`;

    const teamText = this.add
      .text(centerX, 52, teamStr, {
        fontFamily: '"Volkhov", serif',
        fontSize: '12px',
        color: '#030303',
        align: 'center',
        lineSpacing: 5,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setResolution(2);

    let currentY = Math.round(teamText.y + teamText.displayHeight + 22);

    const thirdPartyStr =
      `THIRD-PARTY ASSETS\n` +
      `Momonga • LuizMelo • Pixfinity • cptfoorman • Anokolisa • Foozle • GandalfHardcore • Ansimuz\n` +
      `Wenrexa • Pixel Explosive • Craftpix • La Red Games • Dusk Games • Pimen • Jz Pixels • Frostwindz\n` +
      `greedy_toad • bluecarrot16 & LPC (b_o, Sharm, J. Charlot, Yar, Jetrel, Zabin, Hyptosis,\n` +
      `Surt, KnoblePersona) • Ivan Petrov & Cyreal • freesound_community • Dragon Studio • Yodguard • Liecio\n` +
      `SoundReality • TomMusic • Daniel SoundsGood • Last Day Dreaming • floraphonic • Tithuh`;

    const thirdPartyText = this.add
      .text(centerX, currentY, thirdPartyStr, {
        fontFamily: '"Volkhov", serif',
        fontSize: '11px',
        color: '#030303',
        align: 'center',
        lineSpacing: 5,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setResolution(2);

    currentY = Math.round(thirdPartyText.y + thirdPartyText.displayHeight + 20);

    const divider = this.add.graphics();
    divider.lineStyle(1, 0x030303, 0.25);
    divider.lineBetween(centerX - 240, currentY, centerX + 240, currentY);

    const footerY = currentY + 14;

    const leftColX = centerX - 125;
    const madeByLabel = this.add
      .text(leftColX, footerY, 'A GAME BY', {
        fontFamily: '"Volkhov", serif',
        fontSize: '11px',
        color: '#1a1a1a',
        align: 'center',
        fontStyle: 'bold',
        letterSpacing: 1,
      })
      .setOrigin(0.5, 0)
      .setResolution(2);

    const studioText = this.add
      .text(leftColX, madeByLabel.y + madeByLabel.displayHeight + 4, 'SPLIT SCREEN SQUAD', {
        fontFamily: '"Volkhov", serif',
        fontSize: '13px',
        color: '#030303',
        align: 'center',
        fontStyle: 'bold',
        letterSpacing: 1,
      })
      .setOrigin(0.5, 0)
      .setResolution(2);

    const badge = this.add.graphics();
    const outerRadius = 4.5;
    const innerRadius = 2.6;
    badge.lineStyle(1.2, 0x030303, 0.85);
    badge.strokeCircle(0, 0, outerRadius);
    badge.fillStyle(0x030303, 0.85);
    badge.slice(0, 0, innerRadius, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(90), false);
    badge.fillPath();
    badge.setPosition(
      studioText.x + studioText.width / 2 + outerRadius + 5,
      studioText.y + studioText.height * 0.1
    );

    const rightColX = centerX + 135;
    const madeWithText = this.add
      .text(rightColX, footerY, 'MADE WITH', {
        fontFamily: '"Volkhov", serif',
        fontSize: '11px',
        color: '#1a1a1a',
        align: 'center',
        fontStyle: 'bold',
        letterSpacing: 1,
      })
      .setOrigin(0.5, 0)
      .setResolution(2);

    this.phaserLogo = this.add
      .image(
        rightColX,
        madeWithText.y + madeWithText.displayHeight + 4,
        MISC.PHASER_PIXEL_MEDIUM_FLAT
      )
      .setOrigin(0.5, 0)
      .setAlpha(0.7)
      .setInteractive({ useHandCursor: true });

    this.phaserLogo.on('pointerup', this.handleLogoClick);
    this.phaserLogo.on('pointerover', this.handleLogoOver);
    this.phaserLogo.on('pointerout', this.handleLogoOut);

    this.add
      .text(
        rightColX,
        this.phaserLogo.y + this.phaserLogo.displayHeight + 3,
        `v${Phaser.VERSION}`,
        {
          fontFamily: '"Volkhov", serif',
          fontSize: '11px',
          color: '#1a1a1a',
          align: 'center',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5, 0)
      .setResolution(2);

    const backBtn = this.createButton(centerX, 550, {
      key: UI.MISC_UI_BACK_BTN,
      action: () => {
        this.closeCredits();
      },
    });

    this.buttons.push(backBtn);
  }

  private closeCredits(): void {
    if (this.phaserLogo) {
      this.phaserLogo.off('pointerup', this.handleLogoClick);
      this.phaserLogo.off('pointerover', this.handleLogoOver);
      this.phaserLogo.off('pointerout', this.handleLogoOut);
      this.phaserLogo.disableInteractive();
      this.phaserLogo.destroy();
      this.phaserLogo = null;
    }

    this.scene.wake('MainMenuScene');
    this.parentScene?.refreshMenu();
    this.scene.stop();
  }
}
