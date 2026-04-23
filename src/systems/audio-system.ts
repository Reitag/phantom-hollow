export class AudioSystem {
  private currentAmbient: Phaser.Sound.BaseSound | null = null;
  private currentKey: string | null = null;

  constructor(private scene: Phaser.Scene) {}

  public play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    this.scene.sound.play(key, config);
  }

  public playAmbient(key: string, volume: number = 0.5) {
    if (this.currentKey === key) return;
    this.currentKey = key;

    if (this.currentAmbient) {
      this.currentAmbient.stop();
      this.currentAmbient.destroy();
      this.currentAmbient = null;
    }

    const ambient = this.scene.sound.add(key, { volume: volume, loop: true });
    ambient.play();

    this.currentAmbient = ambient;

    /*this.scene.tweens.add({
      targets: this.currentAmbient,
      volume: volume,
      duration: 3000,
    });*/
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
          this.currentAmbient = null;
        },
      });
    } else {
      this.currentAmbient.stop();
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
