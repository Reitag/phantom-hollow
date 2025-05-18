import Phaser from "phaser";

import { SCENE_SIZE, SPELLS } from "../config/constants";
import { PLAYER_COOLDWON_SPELLS } from "../globals/spell-cooldowns";

export class UiScene extends Phaser.Scene {
  constructor() {
    super("UiScene");

    this.fireBallIcon = null;
    this.blinkIcon = null;
    this.spellBg = null;
    this.castBg = null;
    this.currentCastTween = null;

    const iconXfirst = 400;
    const xStep = 50;
    const iconY = 625;

    this.coords = {
      uiBg: {
        x: 0,
        y: SCENE_SIZE.HEIGHT,
        width: SCENE_SIZE.WIDTH,
        height: 60,
      },
      castBar: {
        x: SCENE_SIZE.WIDTH / 2,
        y: 600,
        width: 200,
        height: 10,
      },
      fireBall: { x: iconXfirst, y: iconY },
      blink: { x: iconXfirst + xStep, y: iconY },
    };

    this.iconOverlays = {
      [SPELLS.FIREBALL]: this.coords.fireBall,
      [SPELLS.BLINK]: this.coords.blink,
    };
  }

  create() {
    const { uiBg, castBar, fireBall, blink } = this.coords;

    this.addRectangle(uiBg, 0x000000).setOrigin(0, 1);

    this.castBg = this.addRectangle(castBar, 0x101010);

    this.fireBallIcon = this.addImage(fireBall, "fire-ball-icon");
    this.blinkIcon = this.addImage(blink, "blink-icon");
  }

  startCast(duration, onComplete) {
    const { x, y, width, height } = this.coords.castBar;

    const fill = this.add
      .rectangle(x - width / 2, y, width, height, 0xffffff)
      .setOrigin(0, 0.5);
    fill.scaleX = 0;

    if (this.currentCastTween) {
      this.currentCastTween.kill();
    }

    this.currentCastTween = this.tweens.add({
      targets: fill,
      scaleX: 1,
      ease: "Linear",
      duration,
      onComplete: () => {
        fill.destroy();
        this.currentCastTween = null;
        onComplete();
      },
    });
  }

  startIconCooldown(spellKey, duration) {
    const { x, y } = this.iconOverlays[spellKey];
    const overlay = this.add.graphics();
    const fullCircle = 360;

    this.tweens.addCounter({
      from: fullCircle,
      to: 0,
      duration,
      ease: "Linear",
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.addCooldownEffect(overlay, x, y, value);
      },
      onComplete: () => {
        this.addFlashTween(x, y);
        overlay.destroy();
      },
    });
  }

  startGlobalCooldown(duration) {
    const spel1 = this.add.graphics();
    const spel2 = this.add.graphics();

    const overlays = [
      [this.iconOverlays[SPELLS.FIREBALL], spel1, false],
      [
        this.iconOverlays[SPELLS.BLINK],
        spel2,
        PLAYER_COOLDWON_SPELLS.blink ? true : false,
      ],
    ];

    const fullCircle = 360;

    this.tweens.addCounter({
      from: fullCircle,
      to: 0,
      duration,
      ease: "Linear",
      onUpdate: (tween) => {
        const value = tween.getValue();

        overlays.forEach((overlay) => {
          if (!overlay[2]) {
            this.addCooldownEffect(
              overlay[1],
              overlay[0].x,
              overlay[0].y,
              value
            );
          }
        });
      },
      onComplete: () => {
        overlays.forEach((overlay) => {
          if (!overlay[2]) {
            this.addFlashTween(overlay[0].x, overlay[0].y);
          }
          overlay[1].destroy();
        });
      },
    });
  }

  addCooldownEffect(overlay, x, y, value) {
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

  addFlashTween(x, y) {
    const flash = this.add.circle(x, y, 10, 0xffffff, 0.5);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: "Cubic.easeOut",
      onComplete: () => {
        flash.destroy();
      },
    });
  }

  addRectangle({ x, y, width, height }, color) {
    return this.add.rectangle(x, y, width, height, color);
  }

  addImage({ x, y }, key) {
    return this.add.image(x, y, key);
  }
}
