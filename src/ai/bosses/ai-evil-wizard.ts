import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import {
  DREAD_AURA_STATS,
  EVIL_WIZARD_STATS,
  MUTATED_BAT_STATS,
  SHADOW_BOLT_STATS,
} from '@/constants/object-stats';
import { SHADOW_BOLT, SUMMON_BAT } from '@/constants/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { DreadAura } from '@/entities/spells/aura-spells/dread-aura';
import { MutatedBat } from '@/entities/characters/enemies/mutated-bat';
import { CHARACTERS } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { Boss } from '../../base/ai/boss';
import { AiMutatedBat } from '../enemies/ai-mutated-bat';

export class AiEvilWizard extends Boss {
  private readonly spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  private readonly spellCooldowns: SpellCooldowns;
  private readonly castShadowBoltHandler: () => void;

  private readonly dreadAura: DreadAura;
  private readonly aiMutatedBat: AiMutatedBat;

  constructor(boss: Character, player: Player) {
    super(boss, player);

    this.spellCooldowns = new SpellCooldowns(this.boss.scene);
    this.castShadowBoltHandler = this.castShadowBolt.bind(this);

    this.dreadAura = new DreadAura(
      {
        scene: boss.scene,
        position: { x: boss.x, y: boss.y },
        keyName: DREAD_AURA_STATS.KEY_NAME,
        caster: boss,
        damage: DREAD_AURA_STATS.DAMAGE,
      },
      DREAD_AURA_STATS.RANGE
    );

    this.aiMutatedBat = new AiMutatedBat(this.player);
  }

  protected updateBossState(delta: number): void {
    this.boss.update(delta);
    this.aiMutatedBat.update(delta);

    this.dreadAura.update(this.player, delta);

    this.updateAggro(delta, EVIL_WIZARD_STATS.ENGAGE_DISTANCE);
  }

  protected finalCall(): void {
    this.aiMutatedBat.getEnemies().forEach((bat) => {
      if (bat.active && bat.hasVelocity()) {
        bat.setVelocity(0, 0);
      }
    });
  }

  protected chillBehaviour(): void {
    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (currentState !== ENEMY_STATES.PATROL) {
      fsm.changeState(ENEMY_STATES.PATROL, EVIL_WIZARD_STATS.WALK_BOUND);
    }
  }

  protected aggroedBehaviour(): void {
    this.updateFacingDirection();

    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (!this.spellCooldowns.isOnCooldown(SHADOW_BOLT.NAME)) {
      this.spellCooldowns.startCooldown(SHADOW_BOLT.NAME, SHADOW_BOLT.DURATION);
      if (currentState !== ENEMY_STATES.CASTING) {
        fsm.changeState(
          ENEMY_STATES.CASTING,
          this.castShadowBoltHandler,
          SHADOW_BOLT_STATS.CAST_TIME
        );
      }
    }

    if (!this.spellCooldowns.isOnCooldown(SUMMON_BAT.NAME)) {
      this.spellCooldowns.startCooldown(SUMMON_BAT.NAME, SUMMON_BAT.DURATION);
      this.summonBat();
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
        aggro: false,
      },
    }).setDepth(Z_POSITION.ENEMY);

    this.aiMutatedBat.addEnemy(bat);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(bat, true);
  }

  private castShadowBolt(): void {
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
}
