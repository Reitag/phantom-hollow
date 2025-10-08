import { Health } from '@/components/stats/health';
import { Speed } from '@/components/stats/speed';
import { MeleeAttack } from '@/components/stats/melee-attack';
import { Defense } from '@/components/stats/defense';
import { ModifierManager } from '@/managers/modifier-manager';
import { StateMachine } from '@/managers/state-machine';
import { PhysicsSprite } from '@/objects/core/physics-sprite';
import { AnimationConfig, PhysicsSpriteConfig, Stats } from '@/utils/types';

export interface CharacterConfig extends PhysicsSpriteConfig {
  facingRight: boolean;
  stats: {
    health: number | undefined;
    speed: number | undefined;
    meleeAttack: number | undefined;
    defense: number | undefined;
  };
}

export class Character extends PhysicsSprite {
  protected facingRight!: boolean;
  protected isDead = false;
  protected stateMachine: StateMachine;
  protected animations!: AnimationConfig;
  protected modifier: ModifierManager;
  protected walkBound!: number;
  protected patrolRightX!: number;
  protected patrolLeftX!: number;

  protected stats: Stats;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.facingRight = facingRight;
    this.stateMachine = new StateMachine();
    this.modifier = new ModifierManager(this.scene);
    this.stats = {
      health: stats.health !== undefined ? new Health(stats.health) : null,
      speed: stats.speed !== undefined ? new Speed(stats.speed) : null,
      meleeAttack: stats.meleeAttack !== undefined ? new MeleeAttack(stats.meleeAttack) : null,
      defense: stats.defense !== undefined ? new Defense(stats.defense) : null,
    };

    if (!this.facingRight) {
      this.setFlipX(true);
    }

    this.setCollideWorldBounds(true);
  }

  public getStats(): Stats {
    return this.stats;
  }

  public getModifier(): ModifierManager {
    return this.modifier;
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
    if (this.isDead) return;

    const finalDamage = amount * (this.stats.defense?.multiplier ?? 1);
    this.stats.health?.applyDamage(finalDamage);

    this.onDamaged?.();
    this.playHitEffect();

    if (this.stats.health?.zero) {
      this.die();
    }
  }

  public takeAuraDamage(amount: number): void {
    if (this.isDead) return;

    const finalDamage = this.stats.defense?.multiplier ?? 1 * amount;
    this.stats.health?.applyDamage(finalDamage);

    this.setTint(0x8844cc);
    this.setAlpha(0.8);
    this.scene.time.delayedCall(150, () => {
      this.clearTint();
      this.setAlpha(1);
    });

    this.onDamaged?.();

    if (this.stats.health?.zero) {
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
