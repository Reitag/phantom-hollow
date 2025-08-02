import { StateMachine } from '@/managers/state-machine';
import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { AnimationConfig, PhysicsSpriteConfig } from '@/utils/types';

export interface CharacterConfig extends PhysicsSpriteConfig {
  health: number;
  facingRight: boolean;
}

export class Character extends PhysicsSprite {
  protected currentHealth: number;
  protected maxHealth: number;
  protected facingRight!: boolean;
  protected isDead = false;
  protected stateMachine: StateMachine;
  protected animations!: AnimationConfig;
  protected walkBound!: number;
  protected patrolRightX!: number;
  protected patrolLeftX!: number;

  constructor({ scene, position, keyName, frame, health, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.currentHealth = health;
    this.maxHealth = health;
    this.facingRight = facingRight;

    this.stateMachine = new StateMachine();

    if (!this.facingRight) {
      this.setFlipX(true);
    }

    this.setCollideWorldBounds(true);
  }

  public getPatrolLeftX(): number {
    return this.patrolLeftX;
  }

  public getPatrolRightX(): number {
    return this.patrolRightX;
  }

  public getStateMachine(): StateMachine {
    return this.stateMachine;
  }

  public getFacingRight(): boolean {
    return this.facingRight;
  }

  public getAnimations(): AnimationConfig {
    return this.animations;
  }

  public getDead(): boolean {
    return this.isDead;
  }

  public flipCharacterToRight(value: boolean): void {
    this.facingRight = value;
    this.setFlipX(!value);
  }

  public toggleFacingDirection(): void {
    this.facingRight = !this.facingRight;
  }

  public hasVelocity(): boolean {
    return this.arcadeBody.velocity.lengthSq() > 0;
  }

  public switchToState(state: string): void {
    this.stateMachine.changeState(state);
  }

  public takeDamage(amount: number): void {
    this.currentHealth -= amount;
    this.playHitEffect();

    this.onDamaged?.();

    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  protected onDeathStart?(): void {}
  protected onDamaged?(): void {}

  private playHitEffect(): void {
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => this.clearTint());
  }

  private die(): void {
    if (this.isDead) return;

    this.isDead = true;
    this.arcadeBody.enable = false;
    this.onDeathStart?.();
    this.stateMachine.changeState('Death');
  }
}
