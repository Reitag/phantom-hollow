import { ENEMY_STATES, SHARED_STATES } from '@/constants/state-keys';
import { ARCHER_STATS } from '@/constants/object-stats';
import { Player } from '@/entities/characters/player/player';
import { Archer } from '@/entities/characters/enemies/archer';
import { Character } from '@/base/objects/character';
import { StateMachine } from '@/systems/state-machine';
import { Arrow } from '@/entities/weapons/arrow';
import { WEAPONS } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { SpawnPoint } from '@/utils/types';
import { Enemy, EnemyConfig } from '../../base/ai/enemy';

export class AiArcher extends Enemy {
  private launchArrowBind: (character: Character) => void;

  constructor(player: Player) {
    super(player);
    this.isRanged = true;
    this.launchArrowBind = this.launchArrow.bind(this);
  }

  public addEnemy(archer: Archer, spawnPoint?: SpawnPoint): void {
    const enemy: EnemyConfig = {
      unit: archer,
      spawn: spawnPoint ?? null,
    };

    this.enemies.push(enemy);
  }

  protected updateEnemyState(archer: Archer, delta: number): void {
    archer.update(delta);

    const fsm = archer.getStateMachine();
    const currentState = fsm.currentStateName;
    if (currentState === SHARED_STATES.FREEZE) return;

    this.updateAggro(archer, delta);

    if (this.player.getDead()) return;
  }

  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState !== SHARED_STATES.IDLE) {
      fsm.changeState(SHARED_STATES.IDLE);
    }
  }

  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState === ENEMY_STATES.RANGE_ATTACK) return;

    fsm.changeState(
      ENEMY_STATES.RANGE_ATTACK,
      this.player,
      ARCHER_STATS.FRAME_ON_HIT,
      this.launchArrowBind
    );
  }

  protected get engageDistance(): number {
    return ARCHER_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return ARCHER_STATS.SAME_Y_THRESHOLD;
  }

  private launchArrow(character: Character): void {
    const arrow = new Arrow({
      scene: character.scene,
      position: { x: character.x, y: character.y },
      keyName: WEAPONS.ARROW,
      frame: 0,
    });
    arrow.setDepth(Z_POSITION.ITEM);
    CollisionService.resolveGroup(GroupKeys.weapon)?.add(arrow, true);

    arrow.launch(this.player);
  }
}
