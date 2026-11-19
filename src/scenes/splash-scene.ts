import { BaseScene } from '@/base/scene/base-scene';

export class SplashScene extends BaseScene {
  private isTransitioning = false;
  private autoTransitionTimer?: Phaser.Time.TimerEvent;

  private readonly handleSkip = (): void => {
    this.goToMainMenu();
  };

  private readonly handleFadeOutComplete = (): void => {
    this.scene.start('MainMenuScene');
  };

  constructor() {
    super('SplashScene');
  }

  public create(): void {
    this.isTransitioning = false;

    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    this.createAtmosphericBackground(width, height);

    const titleSize = Math.min(36, Math.floor(width * 0.055));
    const subTitleSize = Math.max(12, Math.floor(titleSize * 0.36));

    const subTitleY = centerY - titleSize * 0.65;
    const titleY = centerY + titleSize * 0.25;

    const gameByText = this.add
      .text(centerX, subTitleY, 'A GAME BY', {
        fontFamily: '"Volkhov", serif',
        fontSize: `${subTitleSize}px`,
        fontStyle: 'bold',
        color: '#a89f91',
        letterSpacing: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const decorLines = this.add.graphics();
    const lineGap = gameByText.width / 2 + 12;
    const lineLength = Math.max(20, titleSize * 0.9);
    decorLines.lineStyle(1, 0xa89f91, 0.45);
    decorLines.lineBetween(centerX - lineGap - lineLength, subTitleY, centerX - lineGap, subTitleY);
    decorLines.lineBetween(centerX + lineGap, subTitleY, centerX + lineGap + lineLength, subTitleY);
    decorLines.setAlpha(0);

    const squadText = this.add
      .text(centerX, titleY, 'SPLIT SCREEN SQUAD', {
        fontFamily: '"Volkhov", serif',
        fontSize: `${titleSize}px`,
        fontStyle: 'bold',
        color: '#e0a428',
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const badge = this.add.graphics();
    const outerRadius = Math.max(7, Math.floor(titleSize * 0.24));
    const innerRadius = Math.max(4, Math.floor(outerRadius * 0.58));
    const strokeWidth = Math.max(1.5, outerRadius * 0.22);

    badge.lineStyle(strokeWidth, 0xe0a428, 1);
    badge.strokeCircle(0, 0, outerRadius);
    badge.fillStyle(0xe0a428, 1);
    badge.slice(0, 0, innerRadius, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(90), false);
    badge.fillPath();

    const badgeX = squadText.x + squadText.width / 2 + outerRadius + 8;
    const badgeY = titleY - squadText.height * 0.3;
    badge.setPosition(badgeX, badgeY);
    badge.setScale(0.5);
    badge.setAlpha(0);

    this.tweens.add({
      targets: [gameByText, decorLines, squadText],
      alpha: 1,
      duration: 1150,
      ease: 'Linear',
    });

    this.tweens.add({
      targets: badge,
      alpha: 1,
      scale: 1,
      duration: 650,
      delay: 1450,
      ease: 'Back.easeOut',
    });

    this.autoTransitionTimer = this.time.delayedCall(4400, () => {
      this.goToMainMenu();
    });

    this.input.once('pointerdown', this.handleSkip);
    this.input.keyboard?.once('keydown', this.handleSkip);
  }

  private createAtmosphericBackground(width: number, height: number): void {
    this.cameras.main.setBackgroundColor('#121417');

    const bgKey = 'splash_vignette_bg';
    if (!this.textures.exists(bgKey)) {
      const canvasTexture = this.textures.createCanvas(bgKey, width, height);
      if (canvasTexture) {
        const ctx = canvasTexture.getContext();
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.max(width, height) * 0.7;

        const gradient = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius);
        gradient.addColorStop(0, 'rgba(36, 32, 28, 0.35)');
        gradient.addColorStop(0.65, 'rgba(18, 20, 23, 0.85)');
        gradient.addColorStop(1, 'rgba(8, 9, 11, 1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        canvasTexture.refresh();
      }
    }

    this.add.image(width / 2, height / 2, bgKey).setDepth(-2);

    for (let i = 0; i < 14; i++) {
      const startX = Phaser.Math.Between(0, width);
      const startY = Phaser.Math.Between(0, height);
      const emberSize = Phaser.Math.FloatBetween(1, 2.2);

      const ember = this.add
        .circle(startX, startY, emberSize, 0xe0a428, Phaser.Math.FloatBetween(0.15, 0.4))
        .setDepth(-1);

      this.tweens.add({
        targets: ember,
        y: startY - Phaser.Math.Between(40, 110),
        x: startX + Phaser.Math.Between(-25, 25),
        alpha: 0,
        duration: Phaser.Math.Between(3500, 6000),
        repeat: -1,
        onRepeat: () => {
          ember.setPosition(Phaser.Math.Between(0, width), height + 10);
          ember.setAlpha(Phaser.Math.FloatBetween(0.15, 0.4));
        },
      });
    }
  }

  private goToMainMenu(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.autoTransitionTimer?.remove();
    this.cameras.main.fadeOut(1150, 12, 14, 17);
    this.cameras.main.once('camerafadeoutcomplete', this.handleFadeOutComplete);
  }

  protected cleanup(): void {
    this.autoTransitionTimer?.remove();
    this.input.off('pointerdown', this.handleSkip);
    this.input.keyboard?.off('keydown', this.handleSkip);
    this.cameras?.main?.off('camerafadeoutcomplete', this.handleFadeOutComplete);

    if (this.textures.exists('splash_vignette_bg')) {
      this.textures.remove('splash_vignette_bg');
    }
  }
}
