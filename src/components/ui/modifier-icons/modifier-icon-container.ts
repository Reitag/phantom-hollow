import { TYPE } from '@/constants/modifier-stats';
import { ModifierType } from '@/utils/types';

type ModifierContainerConfig = {
  icon: Phaser.GameObjects.Image;
  timerText: Phaser.GameObjects.Text | undefined;
  type: ModifierType;
};

export class ModifierIconContainer {
  private readonly ICON_SIZE = 32;
  private readonly PADDING = 8;
  private readonly startX = 50;
  private readonly BUFF_Y = 60;
  private readonly DEBUFF_Y = 120;

  private modifierIcons: ModifierContainerConfig[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addModifierIcon(key: string, duration: number | undefined, type: ModifierType): void {
    if (this.findModifierIcon(key)) return;

    const sameTypeIcons = this.modifierIcons.filter((m) => m.type === type);
    const index = sameTypeIcons.length;
    const posX = this.startX + index * (this.ICON_SIZE + this.PADDING);
    const posY = type === TYPE.buff ? this.BUFF_Y : this.DEBUFF_Y;

    const icon = this.scene.add.image(posX, posY, key).setOrigin(0, 0.5);
    icon.setDisplaySize(this.ICON_SIZE, this.ICON_SIZE);
    icon.name = key;

    let timerText: Phaser.GameObjects.Text | undefined;
    if (duration) {
      timerText = this.scene.add
        .text(posX + this.ICON_SIZE / 2, posY + this.ICON_SIZE / 2 + 4, `${duration / 1000}`, {
          font: '14px Arial',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        })
        .setOrigin(0.5, 0);
    }

    this.modifierIcons.push({ icon, timerText, type });
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
