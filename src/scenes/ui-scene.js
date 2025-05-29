import Phaser from "phaser";
import { ImageBase } from "../objects/base/image-base";
import { GraphicsMask } from "../components/graphics-mask";

import { SCENE_SIZE, SPELLS } from "../config/constants";
import { PLAYER_COOLDWON_SPELLS } from "../globals/spell-cooldowns";

export class UiScene extends Phaser.Scene {
  constructor() {
    super("UiScene");

    this.fireBallIcon = null;
    this.blinkIcon = null;
    this.spellBg = null;
    this.lightSpellIcon = null;

    this.castBg = null;
    this.castEnv = null;
    this.castMask = null;
    this.currentCastTween = null;

    this.playerHealth = null;
    this.healthEnv = null;
    this.healthMask = null;

    const iconXfirst = 314;
    const xStep = 57;
    const iconY = 620;
    this.healthUi = {
      x: 30,
      y: 607,
      width: 120,
      height: 12,
    };
    this.castUi = {
      x: 30,
      y: 633,
      width: 120,
      height: 12,
    };

    this.coords = {
      uiBg: {
        x: 0,
        y: SCENE_SIZE.HEIGHT - 30,
        width: SCENE_SIZE.WIDTH,
        height: 60,
      },
      castBar: {
        x: this.castUi.x + 31,
        y: this.castUi.y,
        width: this.castUi.width,
        height: this.castUi.height,
      },
      castEnv: this.castUi,
      healthBar: {
        x: this.healthUi.x + 31,
        y: this.healthUi.y,
        width: this.healthUi.width,
        height: this.healthUi.height,
      },
      healthEnv: this.healthUi,
      fireBall: { x: iconXfirst, y: iconY },
      blink: { x: iconXfirst + xStep, y: iconY },
    };

    this.iconOverlays = {
      [SPELLS.FIREBALL]: this.coords.fireBall,
      [SPELLS.BLINK]: this.coords.blink,
    };
  }

  create() {
    const { uiBg, castBar, castEnv, healthBar, healthEnv, fireBall, blink } =
      this.coords;

    new ImageBase(this, uiBg, "bg-ui", 0, 0.5);

    this.castBg = new ImageBase(this, castBar, "cast-bar", 0, 0.5);
    this.castEnv = new ImageBase(this, castEnv, "cast-env", 0, 0.5);

    this.playerHealth = new ImageBase(this, healthBar, "health-bar", 0, 0.5);
    this.healthEnv = new ImageBase(this, healthEnv, "health-env", 0, 0.5);

    this.fireBallIcon = new ImageBase(this, fireBall, "fire-ball-icon");
    this.blinkIcon = new ImageBase(this, blink, "blink-icon");

    this.createHealthMask();
    this.createCastMask();
  }

  createHealthMask() {
    const { x, y, width, height } = this.coords.healthBar;
    this.healthMask = new GraphicsMask(this)
      .roundedRect({ x, y, width, height })
      .applyTo(this.playerHealth);
  }

  createCastMask() {
    const { x, y, width, height } = this.coords.castBar;
    this.castMask = new GraphicsMask(this)
      .roundedRect({ x, y, width, height })
      .applyTo(this.castBg);
    this.castMask.scaleX = 0;
  }

  reducePlayersHealth(currentHealth, maxHealth) {
    const pct = Math.max(currentHealth / maxHealth, 0);
    this.healthMask.clear();
    this.healthMask.fillStyle(0xffffff);
    this.healthMask.fillRoundedRect(
      this.coords.healthBar.x,
      this.coords.healthBar.y - this.coords.healthBar.height / 2,
      this.coords.healthBar.width * pct,
      this.coords.healthBar.height,
      this.coords.healthBar.height / 2
    );
  }

  addLightSpellIcon(spell) {
    if (this.lightSpellIcon) return;

    const size = 32;
    let x, y;

    switch (spell) {
      case SPELLS.FIREBALL:
        ({ x, y } = this.coords.fireBall);
        break;

      case SPELLS.BLINK:
        ({ x, y } = this.coords.blink);
        break;

      default:
        return;
    }

    this.lightSpellIcon = this.add
      .rectangle(x, y, size, size)
      .setOrigin(0.5)
      .setFillStyle(0xfff8c9, 0.4)
      .setStrokeStyle(2, 0xffffff, 1);
  }

  removeLightSpellIcon() {
    if (this.lightSpellIcon) {
      this.lightSpellIcon.destroy();
      this.lightSpellIcon = null;
    }
  }

  startCast(duration, onComplete) {
    if (this.currentCastTween) {
      this.currentCastTween.kill();
    }

    const { x, y, width, height } = this.coords.castBar;

    this.currentCastTween = this.tweens.add({
      targets: this.castMask,
      scaleX: 1,
      ease: "Linear",
      duration,
      onComplete: () => {
        this.castBg.setTexture("cast-bar-green");
        this.finishCast(x, y, width, height);
        this.currentCastTween = null;
        onComplete();
      },
    });
  }

  finishCast(x, y, width, height) {
    const flash = this.add
      .rectangle(x, y, width, height, 0xfff8c9, 0.4)
      .setOrigin(0, 0.5);

    this.tweens.add({
      targets: flash,
      alpha: { from: 1, to: 0 },
      duration: 200,
      ease: "Cubic.easeOut",
      onComplete: () => {
        flash.destroy();
        this.tweens.add({
          targets: this.castBg,
          alpha: { from: 1, to: 0 },
          ease: "Sine.InOut",
          duration: 500,
          onComplete: () => {
            this.castMask.scaleX = 0;
            this.castBg.alpha = 1;
            this.castBg.setTexture("cast-bar");
          },
        });
      },
    });
  }

  stopCast() {
    if (this.currentCastTween) {
      this.currentCastTween.stop();
      this.castMask.scaleX = 0;
      this.castBg.alpha = 1;
      this.currentCastTween = null;
    }
  }

  startIconCooldown(spellKey, duration) {
    const { x, y } = this.iconOverlays[spellKey];
    const overlay = this.createOverlayMask(x, y);
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
    const spel1 = this.createOverlayMask(
      this.iconOverlays[SPELLS.FIREBALL].x,
      this.iconOverlays[SPELLS.FIREBALL].y
    );
    const spel2 = this.createOverlayMask(
      this.iconOverlays[SPELLS.BLINK].x,
      this.iconOverlays[SPELLS.BLINK].y
    );

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

  createOverlayMask(x, y) {
    const size = 32;
    const half = size / 2;

    const spell = this.add.graphics();
    new GraphicsMask(this)
      .squareOverlay({ x: x - half, y: y - half, size: size })
      .applyTo(spell);

    return spell;
  }
}
