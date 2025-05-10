import { ArcadeSpriteBase } from "../base/arcade-sprite-base";

export class FireBall extends ArcadeSpriteBase{
  constructor({ scene, position, keyName, direction, frame }) {
    super({ scene, position, keyName, frame });

    this.direction = direction;
    this.damage = 120;

    scene.physics.world.once('worldstep', () => {
      this.setWorldColliding();
      this.setVelocityX(300 * direction);
    });

    this.playAnimation(direction);
  }

  setWorldColliding() {
    this.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.onWorldBounds = true;

    this.body.world.on('worldbounds', (body) => {
      if (body.gameObject === this) {
        this.destroy();
      }
    });
  }

  destroyFireBall() {
    this.setVelocityX(80 * this.direction);
    this.anims.play('fire-ball-anim-destroy', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  playAnimation(direction) {
    if (direction === 1) {
      this.anims.play('fire-ball-anim');
    } else {
      this.setFlipX(true);
      this.anims.play('fire-ball-anim');
    }
  }
}
