import { TYPE } from '@/constants/modifier-stats';
import { MODIFIER_ICONS } from '@/constants/ui-coordinates';
import { ModifierType } from '@/utils/types';

type ModifierContainerConfig = {
  icon: Phaser.GameObjects.Image;
  timerText: Phaser.GameObjects.Text | undefined;
  type: ModifierType;
};

export class ModifierIconContainer {
  private modifierIcons: ModifierContainerConfig[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addModifierIcon(key: string, duration: number | undefined, type: ModifierType): void {
    if (this.findModifierIcon(key)) return;

    const sameTypeIcons = this.modifierIcons.filter((m) => m.type === type);
    const index = sameTypeIcons.length;
    const posX =
      MODIFIER_ICONS.START_X + index * (MODIFIER_ICONS.ICON_SIZE + MODIFIER_ICONS.PADDING);
    const posY = type === TYPE.buff ? MODIFIER_ICONS.BUFF_Y : MODIFIER_ICONS.DEBUFF_Y;

    const icon = this.scene.add.image(posX, posY, key).setOrigin(0, 0.5);
    icon.setDisplaySize(MODIFIER_ICONS.ICON_SIZE, MODIFIER_ICONS.ICON_SIZE);
    icon.name = key;

    let timerText: Phaser.GameObjects.Text | undefined;
    if (duration) {
      timerText = this.scene.add
        .text(
          posX + MODIFIER_ICONS.ICON_SIZE / 2,
          posY + MODIFIER_ICONS.ICON_SIZE / 2 + 4,
          `${duration / 1000}`,
          {
            font: '14px Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
          }
        )
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

    this.updateUI(entry.type);
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

  private updateUI(type: ModifierType): void {
    const iconsOfType = this.modifierIcons.filter((m) => m.type === type);

    iconsOfType.forEach((m, index) => {
      const posX =
        MODIFIER_ICONS.START_X + index * (MODIFIER_ICONS.ICON_SIZE + MODIFIER_ICONS.PADDING);
      const posY = type === TYPE.buff ? MODIFIER_ICONS.BUFF_Y : MODIFIER_ICONS.DEBUFF_Y;

      m.icon.x = posX;
      m.icon.y = posY;

      if (m.timerText) {
        m.timerText.x = posX + MODIFIER_ICONS.ICON_SIZE / 2;
        m.timerText.y = posY + MODIFIER_ICONS.ICON_SIZE / 2 + 4;
      }
    });
  }
}
