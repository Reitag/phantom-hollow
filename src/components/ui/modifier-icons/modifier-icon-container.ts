type ModifierContainerConfig = {
  icon: Phaser.GameObjects.Image;
  timerText: Phaser.GameObjects.Text | undefined;
};

export class ModifierIconContainer {
  private readonly ICON_SIZE = 32;
  private readonly PADDING = 8;
  private readonly startX = 50;
  private readonly y = 100;

  private modifierIcons: ModifierContainerConfig[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addModifierIcon(key: string, duration: number | undefined): void {
    if (this.findModifierIcon(key)) return;

    const index = this.modifierIcons.length;
    const posX = this.startX + index * (this.ICON_SIZE + this.PADDING);

    const icon = this.scene.add.image(posX, this.y, key).setOrigin(0, 0.5);
    icon.setDisplaySize(this.ICON_SIZE, this.ICON_SIZE);
    icon.name = key;

    let timerText: Phaser.GameObjects.Text | undefined;
    if (duration) {
      timerText = this.scene.add
        .text(posX + this.ICON_SIZE / 2, this.y + this.ICON_SIZE / 2 + 4, `${duration / 1000}`, {
          font: '14px Arial',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        })
        .setOrigin(0.5, 0);
    } else {
      timerText = undefined;
    }

    this.modifierIcons.push({ icon, timerText });
  }

  public startCountdown(key: string, duration: number | undefined): void {
    const entry = this.modifierIcons.find((e) => e.icon.name === key);
    if (!entry || !entry.timerText) return;

    const { timerText } = entry;

    if (duration) {
      const tick = this.scene.time.addEvent({
        delay: 1000,
        repeat: Math.floor(duration / 1000) - 1,
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
  }

  public removeModifierIcon(key: string): void {
    const entry = this.findModifierIcon(key);
    if (!entry) return;

    entry.icon?.destroy();
    entry.timerText?.destroy();
    this.modifierIcons = this.modifierIcons.filter((elem) => elem.icon.name !== key);
  }

  public removeAllModifierIcons(): void {
    for (const entry of this.modifierIcons) {
      entry.icon?.destroy();
      entry.timerText?.destroy();
    }

    this.modifierIcons = [];
  }

  private findModifierIcon(key: string): ModifierContainerConfig | undefined {
    return this.modifierIcons.find((elem) => elem.icon.name === key);
  }
}
