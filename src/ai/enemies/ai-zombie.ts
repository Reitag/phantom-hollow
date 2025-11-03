import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { DISEASE } from '@/constants/modifier-stats';
import { ENEMY_STATES, SHARED_STATES } from '@/constants/state-keys';
import { ZOMBIE_STATS } from '@/constants/object-stats';
import { Player } from '@/entities/characters/player/player';
import { Zombie } from '@/entities/characters/enemies/zombie';
import { StateMachine } from '@/systems/state-machine';
import { Character } from '@/base/objects/character';
import { SpawnPoint } from '@/utils/types';
import { Enemy } from '../../base/ai/enemy';

export class AiZombie extends Enemy {
  constructor(player: Player) {
    super(player);
    this.isRanged = false;
  }

  public addEnemy(enemy: Zombie, spawnPoint?: SpawnPoint): void {
    super.addEnemy(enemy);
    if (spawnPoint) {
      this.spawnMap.set(enemy, spawnPoint);
    }
  }

  protected updateEnemyState(zombie: Zombie, delta: number): void {
    zombie.update(delta);

    const fsm = zombie.getStateMachine();
    const currentState = fsm.currentStateName;
    if (currentState === SHARED_STATES.FREEZE) return;

    this.updateAggro(zombie, delta);

    if (this.player.getDead()) return;

    const { x, y } = this.distanceToPlayer(zombie);

    if (x < ZOMBIE_STATS.ATTACK_RANGE && y < this.sameYThreshold) {
      if (currentState !== ENEMY_STATES.ATTACK) {
        fsm.changeState(
          ENEMY_STATES.ATTACK,
          this.player,
          [ZOMBIE_STATS.HIT, ZOMBIE_STATS.FRAME_ON_HIT],
          this.diseaseTarget
        );
      }
    }
  }

  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState !== ENEMY_STATES.PATROL)
      fsm.changeState(ENEMY_STATES.PATROL, ZOMBIE_STATS.WALK_BOUND);
  }

  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;

    if (enemy.anims.isPlaying && enemy.anims.currentAnim?.key === ENEMIES_ANIMATION.ZOMBIE.ATTACK) {
      return;
    }
    if (currentState === ENEMY_STATES.CHASE) return;

    fsm.changeState(ENEMY_STATES.CHASE, this.player, ZOMBIE_STATS.CHASE);
  }

  protected get engageDistance(): number {
    return ZOMBIE_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return ZOMBIE_STATS.SAME_Y_THRESHOLD;
  }

  private diseaseTarget(): void {
    const player = this.player;
    const debuff = player.getModifier();

    if (!debuff.isModifierExist(DISEASE.id)) {
      debuff.addModifier(DISEASE.id);
      debuff.startModifier(DISEASE.id, player);
    }
  }
}
