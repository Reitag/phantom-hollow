import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { Enemy } from '../../base/ai/enemy';

export class AiSkeletonWarrior extends Enemy {
  protected updateEnemyState(skeleton: SkeletonWarrior, delta: number): void {
    skeleton.update(delta);

    const aggro = skeleton.getStats().aggro;
    if (aggro?.meter && aggro.meter > 0) {
      aggro.decrease(delta);
    }
    //console.log(`Aggro: ${aggro?.meter.toFixed(1)}`);

    const { x, y } = this.distanceToPlayer(skeleton);
    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;

    /*const canEngage = this.canEngage(skeleton, x, y);

    if (!canEngage && !aggro?.isAggroed) {
      if (currentState !== 'Patrol') {
        fsm.changeState('Patrol');
      }
      return;
    } else if (canEngage) {
      aggro?.increase(100);
    } else if (aggro?.isAggroed) {
      if (currentState !== 'Chase') {
        fsm.changeState('Chase', this.player, SKELETON_WARRIOR_STATS.CHASE);
      }
    }*/

    const inRange = this.canEngage(skeleton, x, y);
    const aggroed = aggro?.isAggroed ?? false;

    if (!inRange && !aggroed) return fsm.changeState('Patrol');

    if (inRange) aggro?.increase(1);
    if (aggroed && currentState !== 'Chase')
      fsm.changeState('Chase', this.player, SKELETON_WARRIOR_STATS.CHASE);

    /*if (currentState === 'Wait') {
      if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE) {
        fsm.changeState('Attack', this.player, [
          SKELETON_WARRIOR_STATS.HIT,
          SKELETON_WARRIOR_STATS.FRAME_ON_HIT,
        ]);
        return;
      }
      if (y === 0 && x > SKELETON_WARRIOR_STATS.ATTACK_RANGE) {
        fsm.changeState('Chase', this.player, SKELETON_WARRIOR_STATS.CHASE);
        return;
      }
      return;
    }*/

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
        fsm.changeState('Chase', this.player, SKELETON_WARRIOR_STATS.CHASE);
      }
    }
    console.log(`Aggro: ${aggro?.meter.toFixed(1)}`);
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
