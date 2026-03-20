import { Health } from '@/components/stats/health';
import { Speed } from '@/components/stats/speed';
import { MeleeAttack, SpellPower } from '@/components/stats/damage';
import { Aggro } from '@/components/stats/aggro';
import { Defense } from '@/components/stats/defense';
import { SHARED_STATES } from '@/constants/state-keys';
import { LIGHTNING_SHIELD } from '@/constants/modifier-stats';
import { ModifierSystem } from '@/systems/modifier-system';
import { StateMachine } from '@/systems/state-machine';
import { ArcadeSprite } from '@/base/physics/arcade-sprite';
import { SpriteConfig, Position, Stats } from '@/utils/types';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Casting } from '@/components/stats/casting';
import { UiSystem } from '@/systems/ui-system';

export interface CharacterConfig extends SpriteConfig {
  facingRight: boolean;
  stats: {
    health: number | undefined;
    speed: number | undefined;
    damage: {
      meleeAttack: number | undefined;
      spellPower: number | undefined;
    };
    defense: number | undefined;
    casting: boolean;
    aggro: boolean;
  };
}

export class Character extends ArcadeSprite {
  protected facingRight: boolean;
  protected isDead = false;
  protected stateMachine: StateMachine;
  protected modifier: ModifierSystem;
  protected ui: UiSystem;
  protected stats: Stats;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame });

    this.facingRight = facingRight;
    this.stateMachine = new StateMachine();
    this.modifier = new ModifierSystem(this.scene);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
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
      casting: stats.casting !== false ? new Casting() : null,
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

  public getStateMachine(): StateMachine {
    return this.stateMachine;
  }

  public getFacingRight(): boolean {
    return this.facingRight;
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  public getDead(): boolean {
    return this.isDead;
  }

  public flipCharacterToRight(value: boolean): void {
    if (this.isDead) return;

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

  public makeAlive(): void {
    this.isDead = false;
    this.onAliveStart?.();
  }

  public takeDamage(amount: number, attacker?: Character): void {
    if (this.isDead) return;

    if (this.modifier.isModifierExist(LIGHTNING_SHIELD.id)) {
      this.scene.events.emit('lightning-shield-damage', amount);
      return;
    }

    const finalDamage = amount * (this.stats.defense?.multiplier ?? 1);
    this.stats.health?.applyDamage(finalDamage);

    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.showDamageDealt(finalDamage, this);

    if (attacker && attacker instanceof Player) {
      this.stats?.aggro?.increase(80);
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
  protected onAliveStart?(): void {}
  protected onDamaged?(): void {}

  private playHitEffect(): void {
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
  }

  protected die(): void {
    if (this.isDead) return;

    this.isDead = true;
    this.onDeathStart?.();
    this.stateMachine.changeState(SHARED_STATES.DEATH);
  }
}
