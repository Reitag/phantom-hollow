import { Character } from './character.js';
import { VELOCITY } from "../../config/constants.js";

export class Player extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight, spellFactory }) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.spellFactory = spellFactory; // Spell Factory
    this.isAttacking = false;

    this.body.setSize(20, 48);

    this.on('animationcomplete-simple-attack', () => {
      this.isAttacking = false;
    });
  }

  update() {
    if (this.isDead) return;

    this.setVelocityX(0);
  }

  leftBound() {
    this.setVelocityX(VELOCITY.PLAYER_VELOCITY.MOVE * (-1));
    this.setFlipX(true);
    this.facingRight = false;
    this.anims.play('left', true);
  }

  rightBound() {
    this.setVelocityX(VELOCITY.PLAYER_VELOCITY.MOVE);
    this.setFlipX(false);
    this.facingRight = true;
    this.anims.play('right', true);
  }

  playerJump(){
    this.setVelocityY(VELOCITY.PLAYER_VELOCITY.JUMP * (-1));
  }

  playerIdle() {
    if (this.anims.currentAnim?.key !== 'idle') {
      this.anims.play('idle');
    }
  }

  playerAttack() {
    this.isAttacking = true;
    this.anims.play('simple-attack', true);
    this.setFlipX(!this.facingRight);
    this.scene.time.delayedCall(500, () => this.fireBall());
    return;
  }

  playerBlink() {
    this.spellFactory.castBlink(this, this.facingRight);
  }

  fireBall() {
    this.spellFactory.castFireball(this.x, this.y, this.facingRight);
  }

  takeDamage(amount) {
    this.health -= amount;
    this.playHitEffect();
    console.log(`Health: ${this.health}, amount: ${amount}`);

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;

    this.anims.play('death', true);
    this.removeAllListeners();

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setTexture('player', 101);
      this.body.enable = false;
    });
  }
}
