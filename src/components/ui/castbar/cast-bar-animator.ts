import { CastBar } from './cast-bar';

export class CastBarAnimator {
  private readonly FADE_DURATION = 500;
  private scene: Phaser.Scene;
  private castBar: CastBar;
  private currentTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, castBar: CastBar) {
    this.scene = scene;
    this.castBar = castBar;
  }

  public startCast(duration: number) {
    if (this.currentTween) {
      this.currentTween.stop();
    }

    this.castBar.setCastBar();

    this.castBar.progressWidth = 0;

    this.currentTween = this.scene.tweens.add({
      targets: this.castBar,
      progressWidth: this.castBar.getFullWidth(),
      ease: 'Linear',
      duration,
      onUpdate: () => {
        if (this.castBar.progressWidth) {
          this.castBar.updateMask(this.castBar.progressWidth);
        }
      },
      onComplete: () => {
        this.castBar.setCompletedTexture();
        this.finishCast();
      },
    });
  }

  public stopCast() {
    if (this.currentTween) {
      this.currentTween.stop();
      this.castBar.destroy();
      this.currentTween = null;
    }
  }

  private finishCast() {
    this.scene.tweens.add({
      targets: this.castBar.bar,
      alpha: { from: 1, to: 0 },
      ease: 'Sine.InOut',
      duration: this.FADE_DURATION,
      onComplete: () => {
        this.castBar.destroy();
        this.currentTween = null;
      },
    });
  }
}
