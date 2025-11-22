import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { SPELLS } from '@/constants/asset-keys';

type MaskConfig = { spell: Phaser.GameObjects.Graphics; shape: Phaser.GameObjects.Graphics };
type CooldownOverlay = [{ X: number; Y: number }, MaskConfig, boolean];

export class CooldownAnimator {
  private scene: Phaser.Scene;
  private fullCircle: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.fullCircle = 360;
  }

  public startSingleCooldown(coordinates: Position, duration: number): void {
    const { x, y } = coordinates;
    const overlay = this.createOverlayMask(x, y);

    const counter = this.scene.tweens.addCounter({
      from: this.fullCircle,
      to: 0,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.drawCooldownEffect(x, y, overlay.spell, value);
      },
      onComplete: () => {
        this.flashEffect(x, y);
        overlay.spell.destroy();
        overlay.shape.destroy();
        counter.destroy();
      },
    });
  }

  public startGlobalCooldown(duration: number): void {
    const fireBallOverlay = this.createOverlayMask(
      ICON_OVERLAYS[SPELLS.FIRE_BALL].X,
      ICON_OVERLAYS[SPELLS.FIRE_BALL].Y
    );
    const blinkOverlay = this.createOverlayMask(
      ICON_OVERLAYS[SPELLS.BLINK].X,
      ICON_OVERLAYS[SPELLS.BLINK].Y
    );
    const windOverlay = this.createOverlayMask(
      ICON_OVERLAYS[SPELLS.WIND].X,
      ICON_OVERLAYS[SPELLS.WIND].Y
    );
    const frostBoltOverlay = this.createOverlayMask(
      ICON_OVERLAYS[SPELLS.FROST_BOLT].X,
      ICON_OVERLAYS[SPELLS.FROST_BOLT].Y
    );

    const cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    const overlays: CooldownOverlay[] = [
      [ICON_OVERLAYS[SPELLS.FIRE_BALL], fireBallOverlay, false],
      [ICON_OVERLAYS[SPELLS.BLINK], blinkOverlay, cooldowns.isOnCooldown(SPELLS.BLINK)],
      [ICON_OVERLAYS[SPELLS.WIND], windOverlay, cooldowns.isOnCooldown(SPELLS.WIND)],
      [
        ICON_OVERLAYS[SPELLS.FROST_BOLT],
        frostBoltOverlay,
        cooldowns.isOnCooldown(SPELLS.FROST_BOLT),
      ],
    ];

    const counter = this.scene.tweens.addCounter({
      from: this.fullCircle,
      to: 0,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const value = tween.getValue();

        overlays.forEach(([overlayCoordinates, iconOverlay, isCooldown]) => {
          if (!isCooldown)
            this.drawCooldownEffect(
              overlayCoordinates.X,
              overlayCoordinates.Y,
              iconOverlay.spell,
              value
            );
        });
      },
      onComplete: () => {
        overlays.forEach(([overlayCoordinates, iconOverlay, isCooldown]) => {
          if (!isCooldown) this.flashEffect(overlayCoordinates.X, overlayCoordinates.Y);
          iconOverlay.spell.destroy();
          iconOverlay.shape.destroy();
        });
        overlays.length = 0;
        counter.destroy();
      },
    });
  }

  private createOverlayMask(x: number, y: number): MaskConfig {
    const size = 32;
    const half = size / 2;
    const color = 0xffffff;

    const shape = this.scene.add.graphics();
    shape.visible = false;
    shape.fillStyle(color);
    shape.fillRect(x - half, y - half, size, size);

    const mask = shape.createGeometryMask();

    const spell = this.scene.add.graphics();
    spell.setMask(mask);

    return { spell, shape };
  }

  private drawCooldownEffect(
    x: number,
    y: number,
    overlay: Phaser.GameObjects.Graphics,
    value: number
  ): void {
    const radius = 21;
    const startAngle = 270;

    overlay.clear();
    overlay.fillStyle(0x000000, 0.8);
    overlay.beginPath();
    overlay.moveTo(x, y);
    overlay.slice(
      x,
      y,
      radius,
      Phaser.Math.DegToRad(startAngle),
      Phaser.Math.DegToRad(startAngle - value),
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
}
