import { FireBall } from "../objects/spells/fire-ball";
import { Blink } from "../objects/spells/blink";

export class SpellFactory {
  constructor(scene) {
    this.scene = scene;

    this.spellGroup = this.scene.physics.add.group({
      runChildUpdate: true,
      allowGravity: false
    });
    
    this.cooldownBlink = false;
  }

  castFireball(x, y, facingRight) {
    const direction = facingRight ? 1 : -1;
    const offsetX = direction * 20;
    const fireBall = new FireBall({
      scene: this.scene,
      position: { x: x + offsetX, y: y },
      keyName: 'fire-ball',
      direction: direction,
      frame: 0
    });
    
    this.spellGroup.add(fireBall, true);
  }

  castBlink(player, facingRight) {
    if (this.cooldownBlink) return;

    const direction = facingRight ? 1 : -1;
    player.setVisible(false);
    const blink = new Blink({
      scene: this.scene,
      position: { x: player.x - (4 * direction), y: player.y + 5 },
      keyName: 'blink',
      frame: 0
    });
    blink.useBlink();
    this.cooldownBlink = true;
    this.scene.time.delayedCall(500, () => {
      player.x = player.x + (300 * direction);
      player.setVisible(true);
    });

    this.scene.time.delayedCall(6000, () => this.cooldownBlink = false);
  }

  getSpells() {
    return this.spellGroup;
  }
}
