export class AudioSystem {
  private currentAmbient: Phaser.Sound.BaseSound | null = null;
  private currentKey: string | null = null;

  constructor(private scene: Phaser.Scene) {}

  public play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    this.scene.sound.play(key, config);
  }

  public playAmbient(key: string, volume: number = 1, duration: number = 1500) {
    if (this.currentKey === key) return;

    const previousAmbient = this.currentAmbient;

    const nextAmbient = this.scene.sound.add(key, {
      loop: true,
      volume: 0,
    });

    nextAmbient.play();

    // New Ambient
    this.scene.tweens.add({
      targets: nextAmbient,
      volume: volume,
      duration: duration,
    });

    // Old Ambient
    if (previousAmbient) {
      this.scene.tweens.add({
        targets: previousAmbient,
        volume: 0,
        duration: duration,
        onComplete: () => {
          previousAmbient.stop();
          previousAmbient.destroy();
        },
      });
    }

    this.currentAmbient = nextAmbient;
    this.currentKey = key;
  }

  public stopAmbient(fade: boolean = true) {
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

  // Return instance
  public playControlled(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig
  ): Phaser.Sound.BaseSound {
    const sound = this.scene.sound.add(key, config);
    sound.play();

    return sound;
  }

  public stopAllByKey(key: string) {
    this.scene.sound.stopByKey(key);
  }

  public setMute(value: boolean) {
    this.scene.sound.mute = value;
  }
}
