export type SoundKey = string;

export class AudioSystem {
  private currentAmbient: Phaser.Sound.BaseSound | undefined = undefined;

  constructor(private scene: Phaser.Scene) {}

  public play(key: SoundKey, config?: Phaser.Types.Sound.SoundConfig) {
    this.scene.sound.play(key, config);
  }

  public playAmbient(key: string, volume: number = 0.5) {
    if (this.currentAmbient?.key === key && this.currentAmbient.isPlaying) return;

    this.stopAmbient();

    const ambient = this.scene.sound.add(key, { volume: 0 });
    ambient.play({ loop: true });

    this.scene.tweens.add({
      targets: ambient,
      volume,
      duration: 2000,
      ease: 'Power2',
    });

    this.currentAmbient = ambient;
  }

  public stopAmbient(fade: boolean = true) {
    if (!this.currentAmbient) return;

    if (fade) {
      this.scene.tweens.add({
        targets: this.currentAmbient,
        volume: 0,
        duration: 1000,
        onComplete: () => {
          this.currentAmbient?.stop();
          this.currentAmbient = undefined;
        },
      });
    } else {
      this.currentAmbient.stop();
      this.currentAmbient = undefined;
    }
  }

  // Return instance
  public playControlled(
    key: SoundKey,
    config?: Phaser.Types.Sound.SoundConfig
  ): Phaser.Sound.BaseSound {
    const sound = this.scene.sound.add(key, config);
    sound.play();

    return sound;
  }

  public stopAllByKey(key: SoundKey) {
    this.scene.sound.stopByKey(key);
  }

  public setMute(value: boolean) {
    this.scene.sound.mute = value;
  }
}
