import { Panel, PanelConfig, SlotConfig } from '@/base/ui/panel';
import { SPELLS, UI } from '@/constants/asset-keys';
import { SPELL_TOOLTIPS } from '@/constants/tooltip-params';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { IconDragContext } from '@/utils/types';
import { CooldownAnimator } from '../spell-icons/cooldown-animator';

export class SpellPanel extends Panel {
  private cooldownAnimator: CooldownAnimator;

  constructor({ scene, slotOffSet, cell }: PanelConfig) {
    super({
      scene: scene,
      slotOffSet: slotOffSet,
      cell: cell,
    });

    this.cooldownAnimator = new CooldownAnimator(scene);

    this.createSpellIcons();
  }

  public get freeSlots(): number {
    let result = 0;
    for (const slot of this.slots) {
      if (!slot.icon) ++result;
    }

    return result;
  }

  public startSpellIconCooldown(spellId: string, duration: number): void {
    for (const slot of this.slots) {
      if (slot.icon?.getData('spell') === spellId) {
        this.cooldownAnimator.startSingleCooldown(
          { x: slot.icon.x - 2, y: slot.icon.y - 2 },
          duration
        );
        break;
      }
    }
  }

  public startGlobalSpellIconsCooldown(duration: number): void {
    const targets = [];

    for (const slot of this.slots) {
      const icon = slot.icon;
      if (!icon) continue;

      const spellId = icon.getData('spell');
      if (!spellId) continue;

      targets.push({
        spellId,
        position: { x: icon.x - 2, y: icon.y - 2 },
      });
    }

    this.cooldownAnimator.startGlobalCooldown(targets, duration);
  }

  protected emitSlotRelease(index: number): void {
    const spellId = this.slots[index].icon?.getData('spell');
    if (!spellId) return;

    const player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();

    player.attemptToCastFromSlot(spellId);
  }

  protected dragContext: IconDragContext = {
    onHover: (icon: Phaser.GameObjects.Image) => {
      const spellTooltip = icon.getData('spell-tooltip');
      if (!icon || !spellTooltip) return;

      const ui = ServiceLocator.resolve(ServiceKeys.ui);

      ui.showVerticalTooltip(
        {
          x: icon.x - 220,
          y: icon.y - 20,
          width: 280,
          fillColor: 0x000000,
        },
        spellTooltip
      );
    },

    onHoverOut: () => {
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.hideTooltip();
    },

    onDragStart: (icon: Phaser.GameObjects.Image) => {
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.hideTooltip();

      this.scene.game.canvas.style.cursor = 'grab';
      icon.setDepth(icon.depth + this.depthGap);
    },

    onDrag: (icon: Phaser.GameObjects.Image, x: number, y: number) => {
      icon.setPosition(x, y);
    },

    onDragEnd: (icon: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) => {
      this.scene.game.canvas.style.cursor = 'default';

      const fromIndex = this.slots.findIndex((s) => s.icon === icon);
      if (fromIndex === -1) return;

      const dropIndex = this.getIndex({ x: pointer.x, y: pointer.y });

      if (dropIndex !== -1 && dropIndex !== fromIndex) {
        this.swapIcons(dropIndex, fromIndex);
      } else {
        const pos = this.getCellPosition(fromIndex);
        icon.setPosition(pos.x + 2, pos.y + 2);
      }

      icon.setDepth(icon.depth - this.depthGap);
    },
  };

  private createSpellIcons(): void {
    const spells = [
      { icon: UI.FIRE_BALL_ICON, id: SPELLS.FIRE_BALL, tooltip: SPELL_TOOLTIPS.FIREBALL },
      { icon: UI.BLINK_ICON, id: SPELLS.BLINK, tooltip: SPELL_TOOLTIPS.BLINK },
      { icon: UI.WIND_ICON, id: SPELLS.WIND_WAVE, tooltip: SPELL_TOOLTIPS.WIND },
      { icon: UI.FROSTBOLT_ICON, id: SPELLS.FROST_BOLT, tooltip: SPELL_TOOLTIPS.FROSTBOLT },
    ];

    spells.forEach((spell, i) => {
      const pos = this.getCellPosition(i);

      this.slots[i].icon = this.scene.add
        .image(pos.x + 2, pos.y + 2, spell.icon)
        .setOrigin(0, 0)
        .setDepth(this.ICON_DEPTH)
        .setData('spell', spell.id)
        .setData('spell-tooltip', spell.tooltip)
        .setData('index', i);

      this.clickBinder.set(this.slots[i].icon, i, this.clickContext);
      this.dragBinder.set(this.slots[i].icon, this.dragContext);

      this.clickBinder.bind(this.slots[i].icon);
    });
  }

  private swapIcons(dropIndex: number, fromIndex: number): void {
    const drop = this.slots[dropIndex];
    const from = this.slots[fromIndex];

    [drop.icon, from.icon] = [from.icon, drop.icon];

    if (drop.icon) {
      const pos = this.getCellPosition(dropIndex);
      drop.icon.setPosition(pos.x + 2, pos.y + 2);
      this.rebindClick(drop, dropIndex);
    }

    if (from.icon) {
      const pos = this.getCellPosition(fromIndex);
      from.icon.setPosition(pos.x + 2, pos.y + 2);
      this.rebindClick(from, fromIndex);
    }
  }

  private rebindClick(slot: SlotConfig, index: number): void {
    if (!slot.icon) return;

    this.clickBinder.unbind(slot.icon);
    this.clickBinder.delete(slot.icon);

    this.clickBinder.set(slot.icon, index, this.clickContext);
  }
}
