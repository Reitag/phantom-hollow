import { Health } from '@/components/stats/health';
import { Speed } from '@/components/stats/speed';
import { MeleeAttack, SpellPower } from '@/components/stats/damage';
import { Defense } from '@/components/stats/defense';
import { ModifierSystem } from '@/systems/modifier-system';
import { StateMachine } from '@/systems/state-machine';
import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { AnimationConfig, ArcadeSpriteConfig, Position, Stats } from '@/utils/types';
import { Player } from '@/entities/characters/player/player';
import { Aggro } from '@/components/stats/aggro';

export interface CharacterConfig extends ArcadeSpriteConfig {
  facingRight: boolean;
  stats: {
    health: number | undefined;
    speed: number | undefined;
    damage: {
      meleeAttack: number | undefined;
      spellPower: number | undefined;
    };
    defense: number | undefined;
    aggro: boolean;
  };
}

export class Character extends ArcadeSprite {
  protected facingRight!: boolean;
  protected isDead = false;
  protected stateMachine: StateMachine;
  protected animations!: AnimationConfig;
  protected modifier: ModifierSystem;
  protected walkBound!: number;
  protected patrolRightX!: number;
  protected patrolLeftX!: number;

  protected stats: Stats;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.facingRight = facingRight;
    this.stateMachine = new StateMachine();
    this.modifier = new ModifierSystem(this.scene);
    this.stats = {
      health: stats.health !== undefined ? new Health(stats.health) : null,
      speed: stats.speed !== undefined ? new Speed(stats.speed) : null,
      damage: {
        meleeAttack:
          stats.damage.meleeAttack !== undefined ? new MeleeAttack(stats.damage.meleeAttack) : null,
        spellPower:
          stats.damage.spellPower !== undefined ? new SpellPower(stats.damage.spellPower) : null,
      },
      defense: stats.defense !== undefined ? new Defense(stats.defense) : null,
      aggro: stats.aggro !== false ? new Aggro() : null,
    };

    if (!this.facingRight) {
      this.setFlipX(true);
    }

    this.setCollideWorldBounds(true);
  }

  public getStats(): Stats {
    return this.stats;
  }

  public getModifier(): ModifierSystem {
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

  public getPosition(): Position {
    return { x: this.x, y: this.y };
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

  public takeDamage(amount: number, attacker?: Character): void {
    if (this.isDead) return;

    const finalDamage = amount * (this.stats.defense?.multiplier ?? 1);
    this.stats.health?.applyDamage(finalDamage);

    if (attacker && attacker instanceof Player) {
      this.stats?.aggro?.increase(70);
    }

    this.onDamaged?.();
    this.playHitEffect();

    if (this.stats.health?.zero) {
      this.die();
    }
  }

  public takeAuraDamage(amount: number): void {
    if (this.isDead) return;

    const finalDamage = amount * (this.stats.defense?.multiplier ?? 1);
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
