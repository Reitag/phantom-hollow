import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import {
  DREAD_AURA_STATS,
  EVIL_WIZARD_STATS,
  MUTATED_BAT_STATS,
  SHADOW_BOLT_STATS,
} from '@/constants/object-stats';
import { SHADOW_BOLT, SHADOW_TRAIL, SUMMON_BAT } from '@/constants/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { Health } from '@/components/stats/health';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { DreadAura } from '@/entities/spells/aura-spells/dread-aura';
import { MutatedBat } from '@/entities/characters/enemies/mutated-bat';
import { CHARACTERS, VFX } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { SaveService } from '@/infrastructure/save-service';
import { TriggerZone } from '@/game/interactables/trigger-zone';
import { AttachedVfx } from '@/entities/misc/attached-vfx';
import { VFX_ANIMATION } from '@/constants/animation-keys';
import { Boss } from '../../base/ai/boss';
import { AiMutatedBat } from '../enemies/ai-mutated-bat';

export class AiEvilWizard extends Boss {
  private readonly spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  private readonly spellCooldowns: SpellCooldowns;
  private readonly castShadowBoltHandler: () => void;

  private readonly aiMutatedBat: AiMutatedBat;

  private dreadAura: DreadAura | null;
  private isBusy = false;

  constructor(boss: Character, player: Player) {
    super(boss, player);

    this.spellCooldowns = new SpellCooldowns(this.scene);
    this.castShadowBoltHandler = this.castShadowBolt.bind(this);

    this.dreadAura = this.createDreadAura();

    this.aiMutatedBat = new AiMutatedBat(this.player);

    this.triggerZone = new TriggerZone(this.boss.scene, 'evil-wizard');
    this.scene.events.on(this.triggerZone.triggerEventOn, this.triggerOn, this);
    this.scene.events.on(this.triggerZone.triggerEventOff, this.triggerOff, this);
  }

  protected updateBossState(time: number, delta: number): void {
    if (this.isBusy) this.isBusy = false;

    this.boss.update(delta);
    this.aiMutatedBat.update(delta);

    this.dreadAura?.update(this.player, delta);
    this.updateAggro(delta, EVIL_WIZARD_STATS.ENGAGE_DISTANCE);

    this.bossHealthBar('evil-wizard');
  }

  protected finalCall(): void {
    this.dreadAura?.destroy();
    this.dreadAura = null;

    this.aiMutatedBat.getEnemies().forEach((bat) => {
      if (bat.unit.active && bat.unit.hasVelocity()) {
        bat.unit.setVelocity(0, 0);
        bat.unit.getArcadeBody().allowGravity = false;
      }
    });

    SaveService.patch({
      worldState: {
        ...SaveService.data.worldState,
        killedBosses: [...SaveService.data.worldState.killedBosses, 'evil-wizard'],
      },
    });

    if (!this.triggerZone) return;
    this.scene.events.off(this.triggerZone.triggerEventOn, this.triggerOn, this);
    this.scene.events.off(this.triggerZone.triggerEventOff, this.triggerOff, this);
  }

  protected chillBehaviour(): void {
    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (currentState !== ENEMY_STATES.PATROL) {
      fsm.changeState(ENEMY_STATES.PATROL, EVIL_WIZARD_STATS.WALK_BOUND);
    }
  }

  protected restoreHealthBar(health: Health): void {
    this.ui.reduceBossHealth('evil-wizard', health!.current, health!.max);
  }

  protected aggroedBehaviour(): void {
    this.updateFacingDirection();

    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    const health = this.boss.getStats()?.health;
    if (!health) return;

    if (!this.spellCooldowns.isOnCooldown(SHADOW_BOLT.NAME) && !this.isBusy) {
      this.spellCooldowns.startCooldown(SHADOW_BOLT.NAME, SHADOW_BOLT.DURATION);
      if (currentState !== ENEMY_STATES.CASTING) {
        fsm.changeState(
          ENEMY_STATES.CASTING,
          this.castShadowBoltHandler,
          SHADOW_BOLT_STATS.CAST_TIME
        );
      }
    }

    if (health.current < (health.max * 2) / 3) {
      this.phaseTwo();
    }

    if (health.current < health.max / 3) {
      if (currentState !== ENEMY_STATES.CASTING) {
        this.phaseThree();
      }
    }
  }

  private phaseTwo(): void {
    if (!this.spellCooldowns.isOnCooldown(SUMMON_BAT.NAME)) {
      this.spellCooldowns.startCooldown(SUMMON_BAT.NAME, SUMMON_BAT.DURATION);
      this.summonBat();
    }
  }

  private phaseThree(): void {
    if (!this.spellCooldowns.isOnCooldown(SHADOW_TRAIL.NAME)) {
      this.isBusy = true;
      this.spellCooldowns.startCooldown(SHADOW_TRAIL.NAME, SHADOW_TRAIL.DURATION);
      this.castShadowTral();
    }
  }

  private updateFacingDirection(): void {
    this.boss.flipCharacterToRight(this.player.x > this.boss.x);
  }

  private summonBat(): void {
    const direction = this.boss.getFacingRight();
    const xOffset = 20 * (direction ? 1 : -1);
    const yOffset = Phaser.Math.Between(-10, 10);

    const spawnPos = {
      x: this.boss.x + xOffset,
      y: this.boss.y + yOffset,
    };

    const bat = new MutatedBat({
      scene: this.boss.scene,
      position: spawnPos,
      keyName: CHARACTERS.MUTATED_BAT,
      frame: 0,
      facingRight: direction,
      stats: {
        health: MUTATED_BAT_STATS.HEALTH,
        speed: MUTATED_BAT_STATS.FLY,
        damage: { meleeAttack: undefined, spellPower: undefined },
        defense: undefined,
        casting: false,
        aggro: false,
      },
    }).setDepth(Z_POSITION.ENEMY);

    this.aiMutatedBat.addEnemy(bat);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(bat, true);
  }

  private castShadowBolt(): void {
    if (this.isBusy) return;

    const { x, y } = this.boss.getPosition();
    const flip = this.boss.getFacingRight() ? 1 : -1;

    const handOffsetX = 40 * flip;
    const handOffsetY = 30;

    const spawnPosition = {
      x: x + handOffsetX,
      y: y + handOffsetY,
    };

    const shadowBolt = this.spellFactory.createShadowBolt(this.boss, spawnPosition);
    shadowBolt.cast();
  }

  private castShadowTral(): void {
    this.boss.disableBody(undefined, true);
    this.dreadAura?.destroy();
    this.dreadAura = null;

    const disappear = new AttachedVfx({
      scene: this.scene,
      caster: this.boss,
      keyName: VFX.EVIL_WIZARD_DISAPPEARS_VFX,
      animKey: VFX_ANIMATION.EVIL_WIZARD_DISAPPEARS.MAIN,
      isFlipping: true,
    });

    disappear.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      const spell = this.spellFactory.createShadowTrail(this.boss);
      spell.cast();

      spell.once('spellFinished', () => {
        this.boss.flipCharacterToRight(this.player.x > this.boss.x);

        const appear = new AttachedVfx({
          scene: this.scene,
          caster: this.boss,
          keyName: VFX.EVIL_WIZARD_APPEARS_VFX,
          animKey: VFX_ANIMATION.EVIL_WIZARD_APPEARS.MAIN,
          isFlipping: true,
        });
        appear.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.boss.enableBody(undefined, undefined, undefined, undefined, true);
          this.dreadAura = this.createDreadAura();
          this.isBusy = false;
        });
      });
    });
  }

  private createDreadAura(): DreadAura {
    return new DreadAura(
      {
        scene: this.scene,
        position: { x: this.boss.x, y: this.boss.y },
        keyName: DREAD_AURA_STATS.KEY_NAME,
        caster: this.boss,
        damage: DREAD_AURA_STATS.DAMAGE,
      },
      DREAD_AURA_STATS.RANGE
    );
  }
}
