import { ArcadeSpriteBase } from "../base/arcade-sprite-base.js";

export class Blink extends ArcadeSpriteBase {
  constructor({ scene, position, keyName, frame }) {
    super({ scene, position, keyName, frame });

    this.body.setAllowGravity(false);
  }

  useBlink() {
    this.anims.play('blink-anim', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}
