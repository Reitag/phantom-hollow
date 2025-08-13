import Phaser from 'phaser';
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

  startCast(duration: number, onComplete: () => void) {
    if (this.currentTween) {
      this.currentTween.stop();
    }

    this.castBar.setCastBar();

    this.currentTween = this.scene.tweens.add({
      targets: this.castBar.mask,
      scaleX: 1,
      ease: 'Linear',
      duration,
      onComplete: () => {
        onComplete();
        this.castBar.setCompletedTexture();
        this.finishCast();
      },
    });
  }

  stopCast() {
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
