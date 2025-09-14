import { DamageMultiplier } from '@/components/modules/damage-multiplier';
import { Movement } from '@/components/modules/movement';
import { ModifierManager } from '@/managers/modifier-manager';
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
  protected modifier: ModifierManager;
  protected movement!: Movement;
  protected damageMultiplier: DamageMultiplier;
  protected walkBound!: number;
  protected patrolRightX!: number;
  protected patrolLeftX!: number;

  constructor({ scene, position, keyName, frame, health, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.currentHealth = health;
    this.maxHealth = health;
    this.facingRight = facingRight;

    this.stateMachine = new StateMachine();
    this.modifier = new ModifierManager(this.scene);
    this.damageMultiplier = new DamageMultiplier();

    if (!this.facingRight) {
      this.setFlipX(true);
    }

    this.setCollideWorldBounds(true);
  }

  public getModifier(): ModifierManager {
    return this.modifier;
  }

  public getDamageMultiplier(): DamageMultiplier {
    return this.damageMultiplier;
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

  public getMovement(): Movement {
    return this.movement;
  }

  public switchToState(state: string): void {
    this.stateMachine.changeState(state);
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;

    const finalDamage = this.damageMultiplier.calculateTotal(amount);
    this.currentHealth -= finalDamage;

    this.playHitEffect();
    this.onDamaged?.();

    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  public takeAuraDamage(amount: number): void {
    if (this.isDead) return;

    this.currentHealth -= amount;
    this.setTint(0x8844cc);
    this.setAlpha(0.8);

    this.scene.time.delayedCall(150, () => {
      this.clearTint();
      this.setAlpha(1);
    });

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
    this.onDeathStart?.();
    this.stateMachine.changeState('Death');
  }
}
