import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';
import { SPELLS } from '@/constants/asset-keys';
import { getUiCoords } from '@/utils/helpers';
import { ICON_SIZE } from '@/constants/ui';

type MaskConfig = { spell: Phaser.GameObjects.Graphics; destroy: () => void };
type CooldownTarget = { x: number; y: number; active: boolean };

export class CooldownAnimator {
  private readonly FULL_CIRCLE = 360;
  private readonly ICON_SIZE = ICON_SIZE;
  private readonly ICON_RADIUS = 32;
  private readonly START_ANGLE = 270;

  constructor(private scene: Phaser.Scene) {}

  public startSingleCooldown(position: Position, duration: number): void {
    const target = this.toCentered(position);
    this.runCooldown([{ ...target, active: true }], duration);
  }

  public startGlobalCooldown(duration: number): void {
    const cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    const coords = this.getSpellCoords();

    const targets: CooldownTarget[] = [
      { ...this.toCentered(coords[0]), active: true },
      { ...this.toCentered(coords[1]), active: !cooldowns.isOnCooldown(SPELLS.BLINK) },
      { ...this.toCentered(coords[2]), active: !cooldowns.isOnCooldown(SPELLS.WIND) },
      { ...this.toCentered(coords[3]), active: !cooldowns.isOnCooldown(SPELLS.FROST_BOLT) },
    ];

    this.runCooldown(targets, duration);
  }

  private runCooldown(targets: CooldownTarget[], duration: number): void {
    const overlays = targets.map((target) => ({
      target: target,
      overlay: this.createOverlayMask(target.x, target.y),
    }));

    const counter = this.scene.tweens.addCounter({
      from: this.FULL_CIRCLE,
      to: 0,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const value = tween.getValue();

        overlays.forEach(({ target, overlay }) => {
          if (target.active) {
            this.drawCooldownEffect(target.x, target.y, overlay.spell, value);
          }
        });
      },
      onComplete: () => {
        overlays.forEach(({ target, overlay }) => {
          if (target.active) this.flashEffect(target.x, target.y);
          overlay.destroy();
        });
        overlays.length = 0;
        counter.destroy();
      },
    });
  }

  private createOverlayMask(x: number, y: number): MaskConfig {
    const half = this.ICON_SIZE / 2;
    const color = 0xffffff;

    const shape = this.scene.add.graphics();
    shape.visible = false;
    shape.fillStyle(color);
    shape.fillRect(x - half, y - half, this.ICON_SIZE, this.ICON_SIZE);

    const mask = shape.createGeometryMask();

    const spell = this.scene.add.graphics();
    spell.setMask(mask);

    return {
      spell,
      destroy: () => {
        spell.destroy();
        shape.destroy();
      },
    };
  }

  private drawCooldownEffect(
    x: number,
    y: number,
    overlay: Phaser.GameObjects.Graphics,
    value: number
  ): void {
    overlay.clear();
    overlay.fillStyle(0x000000, 0.8);
    overlay.beginPath();
    overlay.moveTo(x, y);
    overlay.slice(
      x,
      y,
      this.ICON_RADIUS,
      Phaser.Math.DegToRad(this.START_ANGLE),
      Phaser.Math.DegToRad(this.START_ANGLE - value),
      true
    );
    overlay.fillPath();
  }

  private flashEffect(x: number, y: number): void {
    const flash = this.scene.add.circle(x, y, 10, 0xffffff, 0.5);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => flash.destroy(),
    });
  }

  private toCentered(pos: Position): Position {
    const half = this.ICON_SIZE / 2;
    return {
      x: pos.x + half,
      y: pos.y + half,
    };
  }

  private getSpellCoords(): {
    x: number;
    y: number;
  }[] {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const primary = getUiCoords(uiCoords, 'primary');
    const secondary = getUiCoords(uiCoords, 'secondary');
    const tertiary = getUiCoords(uiCoords, 'tertiary');
    const quaternary = getUiCoords(uiCoords, 'quaternary');

    return [primary, secondary, tertiary, quaternary];
  }
}
