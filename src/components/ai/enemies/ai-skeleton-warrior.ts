import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Ai } from '../core/ai';

export class AiSkeletonWarrior extends Ai {
  protected updateEnemyState(skeleton: SkeletonWarrior): void {
    skeleton.update();

    const { x, y } = this.distanceToPlayer(skeleton);
    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;
    const movement = skeleton.getMovement();

    const canEngage = this.canEngage(skeleton, x, y);

    if (!canEngage) {
      if (currentState !== 'Patrol') {
        movement.removeAllModifiers();
        fsm.changeState('Patrol', movement.getCurrentSpeed());
      }
      return;
    }

    if (currentState === 'Wait') {
      if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE) {
        fsm.changeState('Attack', this.player, [
          SKELETON_WARRIOR_STATS.HIT,
          SKELETON_WARRIOR_STATS.FRAME_ON_HIT,
        ]);
        return;
      }
      if (y === 0 && x > SKELETON_WARRIOR_STATS.ATTACK_RANGE) {
        movement.addModifier(SKELETON_WARRIOR_STATS.CHASE);
        fsm.changeState('Chase', this.player);
        return;
      }
      return;
    }

    if (
      skeleton.anims.isPlaying &&
      skeleton.anims.currentAnim?.key === ENEMIES_ANIMATION.SKELETON_WARRIOR.SIMPLE_ATTACK
    ) {
      return;
    } else if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE) {
      if (currentState !== 'Attack') {
        fsm.changeState('Attack', this.player, [
          SKELETON_WARRIOR_STATS.HIT,
          SKELETON_WARRIOR_STATS.FRAME_ON_HIT,
        ]);
      }
    } else {
      if (currentState !== 'Chase') {
        movement.addModifier(SKELETON_WARRIOR_STATS.CHASE);
        fsm.changeState('Chase', this.player);
      }
    }
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
