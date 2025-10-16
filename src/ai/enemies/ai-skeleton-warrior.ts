import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { StateMachine } from '@/systems/state-machine';
import { Character } from '@/base/objects/character';
import { Enemy } from '../../base/ai/enemy';

export class AiSkeletonWarrior extends Enemy {
  protected updateEnemyState(skeleton: SkeletonWarrior, delta: number): void {
    skeleton.update(delta);
    if (this.player.getDead()) return;

    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;
    const { x, y } = this.distanceToPlayer(skeleton);

    if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE && y < this.sameYThreshold) {
      if (currentState !== 'Attack') {
        fsm.changeState('Attack', this.player, [
          SKELETON_WARRIOR_STATS.HIT,
          SKELETON_WARRIOR_STATS.FRAME_ON_HIT,
        ]);
      }
    }
  }

  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState !== 'Patrol') fsm.changeState('Patrol');
  }

  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;

    if (
      enemy.anims.isPlaying &&
      enemy.anims.currentAnim?.key === ENEMIES_ANIMATION.SKELETON_WARRIOR.SIMPLE_ATTACK
    ) {
      return;
    }
    if (currentState === 'Chase') return;

    fsm.changeState('Chase', this.player, SKELETON_WARRIOR_STATS.CHASE);
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
