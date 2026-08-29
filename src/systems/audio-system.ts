export class AudioSystem {
  private currentAmbient: Phaser.Sound.BaseSound | null = null;
  private currentKey: string | null = null;

  constructor(private scene: Phaser.Scene) {}

  public play(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    this.scene.game.audioService.sfx.play(key, config);
  }

  public playAmbient(key: string, duration: number = 1500): void {
    if (this.currentKey === key && this.currentAmbient !== null) return;

    const volume = this.scene.game.audioService.sfxVolume;
    const previousAmbient = this.currentAmbient;
    this.currentKey = key;

    if (volume === 0) {
      this.currentAmbient = null;
      if (previousAmbient) {
        previousAmbient.stop();
        previousAmbient.destroy();
      }
      return;
    }

    const nextAmbient = this.scene.sound.add(key, { loop: true });
    // Explicitly set 0 because Phaser/browser can ignore config volume on play
    nextAmbient.volume = 0;

    this.currentAmbient = nextAmbient;

    const activateNextAmbient = () => {
      if (volume === 0 || this.currentKey !== key) {
        nextAmbient.stop();
        nextAmbient.destroy();
        if (this.currentKey === key) this.currentAmbient = null;
        return;
      }

      nextAmbient.play();

      this.scene.tweens.add({
        targets: nextAmbient,
        volume: volume,
        duration: duration,
      });
    };

    if (previousAmbient) {
      this.scene.tweens.add({
        targets: previousAmbient,
        volume: 0,
        duration: duration,
        onComplete: () => {
          previousAmbient.stop();
          previousAmbient.destroy();
          activateNextAmbient();
        },
      });
    } else {
      activateNextAmbient();
    }
  }

  public stopAmbient(fade: boolean = true): void {
    if (!this.currentAmbient) {
      this.currentKey = null;
      return;
    }

    this.currentKey = null;

    if (fade) {
      this.scene.tweens.add({
        targets: this.currentAmbient,
        volume: 0,
        duration: 1000,
        onComplete: () => {
          this.currentAmbient?.stop();
          this.currentAmbient?.destroy();
          this.currentAmbient = null;
        },
      });
    } else {
      this.currentAmbient.stop();
      this.currentAmbient?.destroy();
      this.currentAmbient = null;
    }
  }

  public playBackgroundMusic(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    this.scene.game.audioService.music.play(key, config);
  }

  // Return instance
  public playControlled(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig
  ): Phaser.Sound.BaseSound {
    const sound = this.scene.game.audioService.sfx.play(key, config);

    return sound;
  }

  public stopAllByKey(key: string) {
    this.scene.sound.stopByKey(key);
  }

  public setMute(value: boolean) {
    this.scene.sound.mute = value;
  }
}
