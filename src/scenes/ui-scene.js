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

    this.addImage(uiBg, "bg-ui", true);

    this.castBg = this.addImage(castBar, "cast-bar", true);
    this.castEnv = this.addImage(castEnv, "cast-env", true);

    this.playerHealth = this.addImage(healthBar, "health-bar", true);
    this.healthEnv = this.addImage(healthEnv, "health-env", true);

    this.fireBallIcon = this.addImage(fireBall, "fire-ball-icon", false);
    this.blinkIcon = this.addImage(blink, "blink-icon", false);

    this.createHealthMask();
    this.createCastMask();
  }

  createHealthMask() {
    const { x, y, width, height } = this.coords.healthBar;
    const radius = height / 2;
    const [_, healthMask, mask] = this.createMask();

    healthMask.fillStyle(0xffffff);
    healthMask.fillRoundedRect(x, y - height / 2, width, height, radius);
    healthMask.visible = false;
    this.playerHealth.setMask(mask);
    this.healthMask = healthMask;
  }

  createCastMask() {
    const { x, y, width, height } = this.coords.castBar;
    const radius = height / 2;
    const [_, castMask, mask] = this.createMask();

    castMask.fillStyle(0xffffff);
    castMask.fillRoundedRect(x, y - height / 2, width, height, radius);
    castMask.visible = false;
    castMask.scaleX = 0;
    this.castBg.setMask(mask);
    this.castMask = castMask;
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

  startCast(duration, onComplete) {
    if (this.currentCastTween) {
      this.currentCastTween.kill();
    }

    this.currentCastTween = this.tweens.add({
      targets: this.castMask,
      scaleX: 1,
      ease: "Linear",
      duration,
      onComplete: () => {
        this.tweens.add({
          targets: this.castMask,
          scaleX: 0,
          ease: "Linear",
          duration: 1500,
        });
        this.currentCastTween = null;
        onComplete();
      },
    });
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
    const [spell, spellShape, mask] = this.createMask();

    const size = 32;
    const offset = size / 2;

    spellShape.fillStyle(0xffffff);
    spellShape.fillRect(x - offset, y - offset, size, size);

    spellShape.setVisible(false);
    spell.setMask(mask);

    return spell;
  }

  createMask() {
    const graphics = this.add.graphics();
    const graphicsShape = this.add.graphics();
    const mask = graphicsShape.createGeometryMask();

    return [graphics, graphicsShape, mask];
  }

  addRectangle({ x, y, width, height }, color) {
    return this.add.rectangle(x, y, width, height, color);
  }

  addImage({ x, y }, key, setOrigin) {
    const image = this.add.image(x, y, key);

    if (setOrigin === true) {
      return image.setOrigin(0, 0.5);
    }
    return image;
  }
}
