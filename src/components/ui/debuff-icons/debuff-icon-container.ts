type DebuffContainerConfig = {
  icon: Phaser.GameObjects.Image;
  timerText: Phaser.GameObjects.Text;
};

export class DebuffIconContainer {
  private debuffIcons: DebuffContainerConfig[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addDebuffIcon(key: string, duration: number): void {
    const posX = this.debuffIcons.length + 50;
    const icon = this.scene.add.image(posX, 100, key).setOrigin(0, 0.5);
    icon.name = key;

    const timerText = this.scene.add
      .text(posX, 100, `${duration / 1000}`, {
        font: '16px Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0);

    this.debuffIcons.push({ icon, timerText });
  }

  public startCountdown(key: string, totalDuration: number): void {
    const entry = this.debuffIcons.find((e) => e.icon.name === key);
    if (!entry) return;

    const { timerText } = entry;

    const tick = this.scene.time.addEvent({
      delay: 1000,
      repeat: Math.floor(totalDuration / 1000) - 1,
      callback: () => {
        if (!timerText || !timerText.active) {
          tick.remove();
          timerText.destroy();
          return;
        }

        if (!timerText) tick.destroy();
        const current = parseInt(timerText.text);
        timerText.setText(`${Math.max(0, current - 1)}`);
      },
    });
  }

  public removeDebuffIcon(key: string): void {
    const entry = this.findDebuffIcon(key);
    if (!entry) return;

    entry.icon.destroy();
    entry.timerText.destroy();
    this.debuffIcons = this.debuffIcons.filter((elem) => elem.icon.name !== key);
  }

  private findDebuffIcon(key: string): DebuffContainerConfig | undefined {
    return this.debuffIcons.find((elem) => elem.icon.name === key);
  }
}
