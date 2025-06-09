import { FireBall } from "../objects/spells/fire-ball";
import { Blink } from "../objects/spells/blink";
import { SPELLS, SPELLS_COOLDOWNS, DEPTH } from "../config/constants";
import { PLAYER_COOLDWON_SPELLS } from "../globals/spell-cooldowns";

export class SpellFactory {
  constructor(scene) {
    this.scene = scene;
    this.ui = this.scene.scene.get("UiScene");

    this.spellGroup = this.scene.physics.add.group({
      runChildUpdate: true,
      allowGravity: false,
    });
  }

  castFireball(x, y, facingRight) {
    const direction = facingRight ? 1 : -1;
    const offsetX = direction * 20;
    const fireBall = new FireBall({
      scene: this.scene,
      position: { x: x + offsetX, y: y },
      keyName: SPELLS.FIREBALL,
      direction: direction,
      frame: 0,
    });

    this.spellGroup.add(fireBall, true);

    this.setGlobalCooldown();
  }

  castBlink(player, facingRight) {
    if (PLAYER_COOLDWON_SPELLS.blink) return;

    const direction = facingRight ? 1 : -1;
    const distance = 300;
    const delay = 500;

    player.setVisible(false);
    player.body.enable = false;
    const blink = new Blink({
      scene: this.scene,
      position: { x: player.x - 4 * direction, y: player.y + 5 },
      keyName: SPELLS.BLINK,
      frame: 0,
    });
    blink.setDepth(DEPTH.SPELL);
    blink.useBlink();
    PLAYER_COOLDWON_SPELLS.blink = true;
    this.scene.time.delayedCall(delay, () => {
      player.body.enable = true;
      player.x = player.x + distance * direction;
      player.setVisible(true);
    });

    this.ui.startIconCooldown(SPELLS.BLINK, SPELLS_COOLDOWNS.BLINK);
    this.scene.time.delayedCall(
      SPELLS_COOLDOWNS.BLINK,
      () => (PLAYER_COOLDWON_SPELLS.blink = false)
    );

    this.setGlobalCooldown();
  }

  setGlobalCooldown() {
    const delay = SPELLS_COOLDOWNS.GLOBAL;

    this.ui.startGlobalCooldown(delay);
    PLAYER_COOLDWON_SPELLS.global = true;

    this.scene.time.delayedCall(
      delay,
      () => (PLAYER_COOLDWON_SPELLS.global = false)
    );
  }

  getSpells() {
    return this.spellGroup;
  }
}
