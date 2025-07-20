import { Character, CharacterConfig } from '@/objects/characters/core/character';
import { Player } from '@/objects/characters/player/player';
import { IdleState } from '@/components/states/characters-states/idle-state';
import { PatrolState } from '@/components/states/characters-states/patrol-state';
import { ChaseState } from '@/components/states/characters-states/chase-state';
import { AttackState } from '@/components/states/characters-states/attack-state';

export class SkeletonWarrior extends Character {
  private walkBound = 470;
  private patrolRightX: number;
  private patrolLeftX: number;
  private isWaiting = false;
  private canHit = false;

  constructor({ scene, position, keyName, health, frame, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.patrolRightX = this.x + this.walkBound;
    this.patrolLeftX = this.x - this.walkBound;

    // State Machine
    this.stateMachine.addState(new IdleState(this));
    this.stateMachine.addState(new PatrolState(this));
    this.stateMachine.addState(new ChaseState(this));
    this.stateMachine.addState(new AttackState(this));
    this.stateMachine.changeState('Idle');

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.hit, this);
    this.arcadeBody.setSize(25, 48);
  }

  update(): void {
    this.stateMachine.update();
  }

  idle() {
    this.setVelocityX(0);
    this.anims.play('sk-warrior-idle', true);
  }

  moveLeft(speed: number): void {
    this.setVelocityX(speed * -1);
    this.setFlipX(true);
    this.anims.play('sk-warrior-left', true);
  }

  moveRight(speed: number): void {
    this.setVelocityX(speed);
    this.setFlipX(false);
    this.anims.play('sk-warrior-right', true);
  }

  patrol(): void {
    if (this.isWaiting) {
      return;
    }

    if (this.facingRight) {
      this.moveRight(60);
      if (this.x >= this.patrolRightX) {
        this.pausePatrol();
      }
    } else {
      this.moveLeft(60);
      if (this.x <= this.patrolLeftX) {
        this.pausePatrol();
      }
    }
  }

  chase(player: Player | null): void {
    if (!player) return;

    const direction = this.x > player.x ? -1 : 1;
    this.facingRight = direction === 1 ? true : false;

    if (direction === 1) {
      this.moveRight(120);
    } else {
      this.moveLeft(120);
    }
  }

  attack(player: Player | null): void {
    if (!player) return;

    this.setVelocityX(0);
    this.anims.play('sk-warrior-simple-attack', true);

    if (this.canHit) {
      player.takeDamage(25);
      this.canHit = false;
    }

    if (player.getDead()) {
      this.anims.stop();
      return;
    }
  }

  hit(anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame): void {
    if (anim.key === 'sk-warrior-simple-attack' && frame.index === 4) {
      this.canHit = true;
    }
  }

  private pausePatrol(): void {
    this.isWaiting = true;
    this.idle();
    this.scene.time.delayedCall(1000, () => {
      this.facingRight = !this.facingRight;
      this.isWaiting = false;
    });
  }

  handlePlatformCollision(): void {
    this.pausePatrol();
  }

  destroy(): void {
    if (this.isDead) return;
    this.isDead = true;

    this.setVelocityX(0);
    this.play('sk-warrior-death', true);
    this.arcadeBody.enable = false;
    this.removeAllListeners();

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setTexture('skeleton-warrior', 37);
    });
  }
}
