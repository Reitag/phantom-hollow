import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { Position } from '@/utils/types';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { SPELLS } from '@/constants/asset-keys';

type CooldownOverlay = [{ X: number; Y: number }, Phaser.GameObjects.Graphics, boolean];

export class CooldownAnimator {
  private scene: Phaser.Scene;
  private fullCircle: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.fullCircle = 360;
  }

  startSingleCooldown(coordinates: Position, duration: number): void {
    const { x, y } = coordinates;
    const overlay = this.createOverlayMask(x, y);

    this.scene.tweens.addCounter({
      from: this.fullCircle,
      to: 0,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.drawCooldownEffect(x, y, overlay, value);
      },
      onComplete: () => {
        this.flashEffect(x, y);
        overlay.destroy();
      },
    });
  }

  startGlobalCooldown(duration: number): void {
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

    const cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    const overlays: CooldownOverlay[] = [
      [ICON_OVERLAYS[SPELLS.FIRE_BALL], fireBallOverlay, false],
      [ICON_OVERLAYS[SPELLS.BLINK], blinkOverlay, cooldowns.isOnCooldown(SPELLS.BLINK)],
      [ICON_OVERLAYS[SPELLS.WIND], windOverlay, cooldowns.isOnCooldown(SPELLS.WIND)],
    ];

    this.scene.tweens.addCounter({
      from: this.fullCircle,
      to: 0,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const value = tween.getValue();

        overlays.forEach(([iconOverlay, overlayCoordinates, isCooldown]) => {
          if (!isCooldown)
            this.drawCooldownEffect(iconOverlay.X, iconOverlay.Y, overlayCoordinates, value);
        });
      },
      onComplete: () => {
        overlays.forEach(([iconOverlay, overlayCoordinates, isCooldown]) => {
          if (!isCooldown) this.flashEffect(iconOverlay.X, iconOverlay.Y);
          overlayCoordinates.destroy();
        });
      },
    });
  }

  private createOverlayMask(x: number, y: number): Phaser.GameObjects.Graphics {
    const size = 32;
    const half = size / 2;

    const spell = this.scene.add.graphics();
    new GraphicsMask(this.scene).squareOverlay({ x: x - half, y: y - half, size }).applyTo(spell);

    return spell;
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
