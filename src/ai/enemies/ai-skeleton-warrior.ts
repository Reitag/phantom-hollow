import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { StateMachine } from '@/systems/state-machine';
import { Character } from '@/base/objects/character';
import { Enemy } from '../../base/ai/enemy';

export class AiSkeletonWarrior extends Enemy {
  constructor(player: Player) {
    super(player);
    this.isRanged = false;
  }
  protected updateEnemyState(skeleton: SkeletonWarrior, delta: number): void {
    skeleton.update(delta);
    if (this.player.getDead()) return;

    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;
    const { x, y } = this.distanceToPlayer(skeleton);

    if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE && y < this.sameYThreshold) {
      if (currentState !== ENEMY_STATES.ATTACK) {
        fsm.changeState(ENEMY_STATES.ATTACK, this.player, [
          SKELETON_WARRIOR_STATS.HIT,
          SKELETON_WARRIOR_STATS.FRAME_ON_HIT,
        ]);
      }
    }
  }

  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState !== ENEMY_STATES.PATROL)
      fsm.changeState(ENEMY_STATES.PATROL, SKELETON_WARRIOR_STATS.WALK_BOUND);
  }

  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;

    if (
      enemy.anims.isPlaying &&
      enemy.anims.currentAnim?.key === ENEMIES_ANIMATION.SKELETON_WARRIOR.ATTACK
    ) {
      return;
    }
    if (currentState === ENEMY_STATES.CHASE) return;

    fsm.changeState(ENEMY_STATES.CHASE, this.player, SKELETON_WARRIOR_STATS.CHASE);
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
