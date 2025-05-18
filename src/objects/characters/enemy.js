import { Character } from "./character.js";
import { createZoneRectangle } from "../zones/zone-rect.js";
import { CHARACTER_STATES } from "../../config/constants.js";

export class Enemy extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight }) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.scene = scene;
    this.needDamage = false;
    this.targetPlayer = null;
    this.shouldWalk = false;
    //this.isVulnerable = false;
    this.switchNeedDamage = this.switchNeedDamage.bind(this);

    this.visionRange = createZoneRectangle({
      scene: scene,
      position: { x: this.x, y: this.y },
      size: { width: 400, height: 50 },
    });

    this.walkZone = null;
    this.state = CHARACTER_STATES.IDLE;

    this.createWalkZone();
    this.body.setSize(20, 48);

    this.addAnimationEvents();
  }

  addAnimationEvents() {
    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.switchNeedDamage);
  }

  removeAnimationEvents() {
    this.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.switchNeedDamage);
  }

  switchNeedDamage(anim, frame) {
    if (anim.key === "sk-warrior-simple-attack" && frame.index === 4) {
      this.needDamage = true;
    }
  }

  update() {
    if (this.isDead) return;

    if (this.targetPlayer?.isDead) {
      this.resetState();
      return;
    }

    switch (this.state) {
      case CHARACTER_STATES.WALK:
        this.handleWalking();
        break;
      case CHARACTER_STATES.IDLE:
        this.handleIdle();
        break;
      case CHARACTER_STATES.CHASE:
        this.chasingPlayer();
        break;
      case CHARACTER_STATES.ATTACK:
        this.dealDamage();
        break;
    }
  }

  resetState() {
    this.state = CHARACTER_STATES.IDLE;
    this.targetPlayer = null;
    this.createWalkZone();
  }

  handleIdle() {
    this.setVelocityX(0);
    this.anims.play("sk-warrior-idle", true);

    if (this.isAlignedWithTarget()) {
      this.anims.stop();
      this.state = CHARACTER_STATES.CHASE;
      return;
    }

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.state = CHARACTER_STATES.WALK;
      if (this.shouldWalk) {
        this.scene.time.delayedCall(100, () => (this.shouldWalk = false));
      }
    });
  }

  handleWalking() {
    this.patrol();

    if (this.isAlignedWithTarget()) {
      this.state = CHARACTER_STATES.CHASE;
    }
  }

  isAlignedWithTarget() {
    return this.targetPlayer && this.y === this.targetPlayer.y;
  }

  createWalkZone() {
    this.walkZone?.destroy?.();

    this.walkZone = createZoneRectangle({
      scene: this.scene,
      position: { x: this.x, y: this.y },
      size: { width: 500, height: 50 },
    });
  }

  patrol() {
    const direction = this.facingRight ? 1 : -1;
    const animKey = this.facingRight ? "sk-warrior-right" : "sk-warrior-left";

    this.setFlipX(!this.facingRight);
    this.setVelocityX(60 * direction);
    this.visionRange.x = this.x;

    this.anims.play(animKey, true);
    this.hitWalkZoneBounds();
  }

  hitWalkZoneBounds() {
    const zoneLeft = this.walkZone.x - this.walkZone.width / 2;
    const zoneRight = this.walkZone.x + this.walkZone.width / 2;

    if ((this.x < zoneLeft || this.x > zoneRight) && !this.shouldWalk) {
      this.setVelocityX(0);
      this.state = CHARACTER_STATES.IDLE;
      this.shouldWalk = true;
      if (this.facingRight === false) {
        this.facingRight = true;
        this.setFlipX(true);
      } else {
        this.facingRight = false;
        this.setFlipX(false);
      }
    }
  }

  startChase(player) {
    this.targetPlayer = player;
    this.state = CHARACTER_STATES.CHASE;
  }

  chasingPlayer() {
    const direction = this.x > this.targetPlayer.x ? -1 : 1;
    this.facingRight = direction === 1 ? true : false;
    const animKey = this.facingRight ? "sk-warrior-right" : "sk-warrior-left";

    this.setFlipX(!this.facingRight);
    this.setVelocityX(130 * direction);
    this.visionRange.x = this.x;

    this.anims.play(animKey, true);

    if (this.targetPlayer.y < this.y - 10) {
      this.scene.time.delayedCall(1500, () => {
        this.enemyChill();
      });
    }
  }

  enemyChill() {
    this.state = CHARACTER_STATES.IDLE;
    this.createWalkZone();
  }

  attackPlayer() {
    this.state = CHARACTER_STATES.ATTACK;
    this.setVelocityX(0);
    this.anims.play("sk-warrior-simple-attack", true);

    if (this.targetPlayer.isDead === true) {
      this.anims.stop();
      return;
    }

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.state = CHARACTER_STATES.CHASE;
    });
  }

  dealDamage() {
    if (this.needDamage) {
      this.targetPlayer.takeDamage(25);
      this.needDamage = false;
    }
  }

  takeDamage(amount, player = null) {
    if (!this.isVulnerable) {
      this.isVulnerable = true;
      this.health -= amount;
      this.playHitEffect();

      if (this.state !== CHARACTER_STATES.CHASE) {
        this.state = CHARACTER_STATES.CHASE;
        this.targetPlayer = player;
      }
    }

    this.scene.time.delayedCall(1500, () => (this.isVulnerable = false));

    if (this.health <= 0) {
      this.destroyEnemy();
    }
  }

  destroyEnemy() {
    if (this.isDead) return;
    this.isDead = true;

    this.setVelocityX(0);
    this.play("sk-warrior-death", true);
    this.body.enable = false;
    this.removeAllListeners();

    if (this.walkZone) {
      this.walkZone.destroy();
      this.walkZone = null;
    }

    if (this.visionRange) {
      this.visionRange.destroy();
      this.visionRange = null;
    }

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setTexture("skeleton-warrior", 37);
    });
  }
}
