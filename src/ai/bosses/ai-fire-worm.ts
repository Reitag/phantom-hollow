import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SaveService } from '@/infrastructure/save-service';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Health } from '@/components/stats/health';
import { FIRE_WORM_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { EARTH_SHAKE } from '@/constants/spell-cooldowns';
import { Player } from '@/entities/characters/player/player';
import { Z_POSITION } from '@/constants/z-position';
import { VFX_ANIMATION } from '@/constants/animation-keys';
import { VFX } from '@/constants/asset-keys';
import { TriggerZone } from '@/game/interactables/trigger-zone';
import { Boss } from '../../base/ai/boss';

export class AiFireWorm extends Boss {
  private static readonly FIREBALL = {
    NAME: 'fireball',
    CAST_TIME: 500,
    COOLDOWN: 5000,
  };

  private readonly spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  private readonly spellCooldowns: SpellCooldowns;
  private readonly castFireballHandler: () => void;

  private isLongFight = false;
  private startFight: number | undefined = undefined;

  constructor(boss: Character, player: Player) {
    super(boss, player);
    this.spellCooldowns = new SpellCooldowns(this.boss.scene);
    this.castFireballHandler = () => this.castFireball();

    this.triggerZone = new TriggerZone(this.boss.scene, 'fire-worm');
    this.scene.events.on(this.triggerZone.triggerEventOn, this.triggerOn, this);
    this.scene.events.on(this.triggerZone.triggerEventOff, this.triggerOff, this);
  }

  protected updateBossState(time: number, delta: number): void {
    this.boss.update();
    this.considerLongFight(time);
    this.updateAggro(delta, FIRE_WORM_STATS.ENGAGE_DISTANCE);

    this.bossHealthBar('fireworm');
  }

  protected chillBehaviour(): void {
    if (this.isLongFight) {
      this.isLongFight = false;
      this.startFight = undefined;
    }

    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (currentState !== ENEMY_STATES.PATROL) {
      fsm.changeState(ENEMY_STATES.PATROL, FIRE_WORM_STATS.WALK_BOUND);
    }
  }

  protected restoreHealthBar(health: Health): void {
    this.ui.reduceBossHealth('fireworm', health!.current, health!.max);
  }

  protected aggroedBehaviour(): void {
    this.updateFacingDirection();

    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (
      !this.spellCooldowns.isOnCooldown(AiFireWorm.FIREBALL.NAME) &&
      currentState !== ENEMY_STATES.CASTING
    ) {
      this.spellCooldowns.startCooldown(AiFireWorm.FIREBALL.NAME, AiFireWorm.FIREBALL.COOLDOWN);
      fsm.changeState(
        ENEMY_STATES.CASTING,
        this.castFireballHandler,
        AiFireWorm.FIREBALL.CAST_TIME
      );
    }

    if (currentState === ENEMY_STATES.CASTING) return;

    if (!this.spellCooldowns.isOnCooldown(EARTH_SHAKE.NAME) && this.isLongFight) {
      this.spellCooldowns.startCooldown(EARTH_SHAKE.NAME, EARTH_SHAKE.DURATION);
      this.castEarthShake();
    }
  }

  protected finalCall(): void {
    this.scene.events.emit('fire-worm:died', {
      x: this.boss.x,
      y: this.boss.y,
    });

    if (!this.triggerZone) return;
    // Preventing stack overflow

    this.scene.events.off(this.triggerZone.triggerEventOn, this.triggerOn, this);
    this.scene.events.off(this.triggerZone.triggerEventOff, this.triggerOff, this);

    SaveService.patch({
      worldState: {
        ...SaveService.data.worldState,
        killedBosses: [...SaveService.data.worldState.killedBosses, 'fire-worm'],
      },
    });
  }

  private updateFacingDirection(): void {
    this.boss.flipCharacterToRight(this.player.x > this.boss.x);
  }

  private considerLongFight(time: number): void {
    if (!this.boss.getStats().aggro?.isAggroed) return;
    if (this.startFight === undefined) {
      this.startFight = time;
      return;
    }

    if (time - this.startFight > 8000 && !this.isLongFight) {
      this.isLongFight = true;
    }
  }

  private castFireball(): void {
    const { x, y } = this.boss.getPosition();
    const flip = this.boss.getFacingRight() ? 1 : -1;

    const handOffsetX = 40 * flip;
    const handOffsetY = 20;

    const spawnPosition = {
      x: x + handOffsetX,
      y: y + handOffsetY,
    };

    const fireball = this.spellFactory.createFireball(this.boss, spawnPosition);
    fireball.cast();
  }

  private castEarthShake(): void {
    if (!this.player.getArcadeBody().blocked.down) return;
    const { x, y } = this.player.getPosition();

    const handOffsetX = 0;
    const handOffsetY = -5;

    const spawnPosition = {
      x: x + handOffsetX,
      y: y + handOffsetY,
    };

    const earthAnxiety = this.player.scene.add
      .sprite(spawnPosition.x, spawnPosition.y, VFX.EARTH_ANXIETY_VFX, 0)
      .setDepth(Z_POSITION.SPELL);

    earthAnxiety.play(VFX_ANIMATION.EARTH_ANXIETY.MAIN, true);
    earthAnxiety.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        earthAnxiety.destroy();
        const earthShake = this.spellFactory.createEarthShake(this.boss, spawnPosition);
        earthShake.cast();
      }
    );
  }
}
