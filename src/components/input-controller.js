import Phaser from "phaser";

import { SPELLS, SPELLS_COOLDOWNS } from "../config/constants";
import { PLAYER_COOLDWON_SPELLS } from "../globals/spell-cooldowns";
import { KEYS } from "../globals/keys";

export class InputController {
  constructor(scene, spellFactory) {
    this.scene = scene;
    this.ui = scene.scene.get("UiScene");
    this.spellFactory = spellFactory;

    KEYS.cursors = scene.input.keyboard.createCursorKeys();
    KEYS.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    KEYS.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  update(player) {
    if (player.isCasting) return;
    if (player.isDead) return;

    if (this.handleAttack(player)) return;
    if (this.handleBlink(player)) return;

    this.handleMovement(player);
    this.handleJump(player);
  }

  handleAttack(player) {
    if (PLAYER_COOLDWON_SPELLS.global) return false;

    if (KEYS.zKey.isDown) {
      this.ui.addLightSpellIcon(SPELLS.FIREBALL);
    } else if (Phaser.Input.Keyboard.JustUp(KEYS.zKey)) {
      this.temporarilyDisableKeys();
      this.ui.removeLightSpellIcon();
      player.playerAttack();

      return true;
    }
    return false;
  }

  handleBlink(player) {
    if (PLAYER_COOLDWON_SPELLS.global) return false;

    if (KEYS.xKey.isDown) {
      this.ui.addLightSpellIcon(SPELLS.BLINK);
    } else if (Phaser.Input.Keyboard.JustUp(KEYS.xKey)) {
      this.temporarilyDisableKeys();
      this.ui.removeLightSpellIcon();
      player.playerBlink();

      return true;
    }
    return false;
  }

  handleMovement(player) {
    const { left, right } = KEYS.cursors;

    if (left.isDown) {
      player.leftBound();
    } else if (right.isDown) {
      player.rightBound();
    } else {
      player.playerIdle();
    }
  }

  handleJump(player) {
    if (
      Phaser.Input.Keyboard.JustDown(KEYS.cursors.up) &&
      player.body.blocked.down
    ) {
      player.playerJump();
    }
  }

  temporarilyDisableKeys(duration = SPELLS_COOLDOWNS.GLOBAL) {
    this.setKeyEnabled(false);
    this.scene.time.delayedCall(duration, () => this.setKeyEnabled(true));
  }

  setKeyEnabled(enabled) {
    if (!KEYS) return;

    for (const key in KEYS) {
      if (key !== "cursors" && KEYS[key]) {
        KEYS[key].enabled = enabled;
      }
    }
  }
}
