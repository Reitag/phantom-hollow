import Phaser from 'phaser';

import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { Position } from '@/utils/types';
import { iconOverlays } from '@/utils/coordinates';
import { SPELLS } from '@/utils/constants';

type CooldownOverlay = [Position, Phaser.GameObjects.Graphics, boolean];

export class CooldownAnimator {
  private scene: Phaser.Scene;
  private cooldowns!: CooldownsState;
  private fullCircle: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.fullCircle = 360;
  }

  setCooldownsState(cooldowns: CooldownsState): void {
    this.cooldowns = cooldowns;
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
      iconOverlays[SPELLS.FIREBALL].x,
      iconOverlays[SPELLS.FIREBALL].y
    );
    const blinkOverlay = this.createOverlayMask(
      iconOverlays[SPELLS.BLINK].x,
      iconOverlays[SPELLS.BLINK].y
    );

    const overlays: CooldownOverlay[] = [
      [iconOverlays[SPELLS.FIREBALL], fireBallOverlay, false],
      [iconOverlays[SPELLS.BLINK], blinkOverlay, this.cooldowns.isOnCooldown(SPELLS.BLINK)],
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
            this.drawCooldownEffect(iconOverlay.x, iconOverlay.y, overlayCoordinates, value);
        });
      },
      onComplete: () => {
        overlays.forEach(([iconOverlay, overlayCoordinates, isCooldown]) => {
          if (!isCooldown) this.flashEffect(iconOverlay.x, iconOverlay.y);
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
