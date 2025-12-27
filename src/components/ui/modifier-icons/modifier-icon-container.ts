import { TYPE } from '@/constants/modifier-stats';
import { MODIFIER_TOOLTIPS } from '@/constants/tooltip-params';
//import { MODIFIER_ICONS } from '@/constants/ui-coordinates';
import { MODIFIER_ICONS } from '@/constants/ui';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';
import { ModifierType, Position } from '@/utils/types';

type ModifierContainerConfig = {
  icon: Phaser.GameObjects.Image;
  timerText: Phaser.GameObjects.Text | undefined;
  type: ModifierType;
};

export class ModifierIconContainer {
  private modifierIcons: ModifierContainerConfig[] = [];
  private buffCoords: Position;
  private deBuffCoords: Position;

  constructor(private scene: Phaser.Scene) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    this.buffCoords = getUiCoords(uiCoords, 'buff');
    this.deBuffCoords = getUiCoords(uiCoords, 'debuff');
  }

  public addModifierIcon(key: string, duration: number | undefined, type: ModifierType): void {
    if (this.findModifierIcon(key)) return;

    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    const sameTypeIcons = this.modifierIcons.filter((m) => m.type === type);
    const index = sameTypeIcons.length;
    const posX = this.buffCoords.x + index * (MODIFIER_ICONS.SIZE + MODIFIER_ICONS.PADDING);
    const posY = type === TYPE.buff ? this.buffCoords.y : this.deBuffCoords.y;

    const icon = this.scene.add.image(posX, posY, key).setOrigin(0, 0);
    icon.setDisplaySize(MODIFIER_ICONS.SIZE, MODIFIER_ICONS.SIZE);
    icon.setInteractive({ useHandCursor: true });
    icon.name = key;

    // Pointer over
    icon.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'help';
      const keyItem = icon.name;
      const tooltipArray = Object.values(MODIFIER_TOOLTIPS).map(
        ({ id, title, prop_1, prop_2, prop_3, prop_4 }) => ({
          id,
          title,
          prop_1,
          prop_2,
          prop_3,
          prop_4,
        })
      );

      const info = tooltipArray.find((tooltip) => keyItem === tooltip.id);
      if (!info) return;
      ui.showVerticalTooltip(
        {
          x: icon.x - 10,
          y: icon.y - 30,
          width: 300,
          fillColor: 0x000000,
        },
        info
      );
    });

    // Pointer out
    icon.on('pointerout', ui.hideTooltip, ui);

    let timerText: Phaser.GameObjects.Text | undefined;
    if (duration) {
      timerText = this.scene.add
        .text(
          posX + MODIFIER_ICONS.SIZE / 2,
          posY + MODIFIER_ICONS.SIZE / 2 + 16,
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
      const posX = this.buffCoords.x + index * (MODIFIER_ICONS.SIZE + MODIFIER_ICONS.PADDING);
      const posY = type === TYPE.buff ? this.buffCoords.y : this.deBuffCoords.y;

      m.icon.x = posX;
      m.icon.y = posY;

      if (m.timerText) {
        m.timerText.x = posX + MODIFIER_ICONS.SIZE / 2;
        m.timerText.y = posY + MODIFIER_ICONS.SIZE / 2 + 4;
      }
    });
  }
}
