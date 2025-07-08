import Phaser from 'phaser';

import { CastBar } from './cast-bar';
import { castBar } from '@/utils/coordinates';

export class CastBarAnimator {
  private readonly FLASH_COLOR = 0xfff8c9;
  private readonly FLASH_DURATION = 200;
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
      this.castBar.reset();
      this.currentTween = null;
    }
  }

  private finishCast() {
    const { x, y, width, height } = castBar;

    const flash = this.scene.add
      .rectangle(x, y, width, height, this.FLASH_COLOR, 0.4)
      .setOrigin(0, 0.5);

    this.scene.tweens.add({
      targets: flash,
      alpha: { from: 1, to: 0 },
      duration: this.FLASH_DURATION,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        flash.destroy();
        this.scene.tweens.add({
          targets: this.castBar.bar,
          alpha: { from: 1, to: 0 },
          ease: 'Sine.InOut',
          duration: this.FADE_DURATION,
          onComplete: () => {
            this.castBar.reset();
            this.currentTween = null;
          },
        });
      },
    });
  }
}
