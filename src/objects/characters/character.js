import { ArcadeSpriteBase } from "../base/arcade-sprite-base";

export class Character extends ArcadeSpriteBase {
  constructor({ scene, position, keyName, health, frame, facingRight }) {
    super({ scene, position, keyName, frame });

    this.health = health;
    this.facingRight = facingRight;
    this.isDead = false;
    this.isVulnerable = false;

    this.setCollideWorldBounds(true);
  }

  playHitEffect() {
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => this.clearTint());
  }
}
