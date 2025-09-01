import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { DISEASE } from '@/constants/modifier-stats';
import { ZOMBIE_STATS } from '@/constants/object-stats';
import { Zombie } from '@/objects/characters/enemies/zombie';
import { Ai } from '../core/ai';

export class AiZombie extends Ai {
  protected updateEnemyState(zombie: Zombie): void {
    zombie.update();

    const { x, y } = this.distanceToPlayer(zombie);
    const fsm = zombie.getStateMachine();
    const currentState = fsm.currentStateName;

    const canEngage = this.canEngage(zombie, x, y);

    if (!canEngage) {
      if (currentState !== 'Patrol') {
        fsm.changeState('Patrol', ZOMBIE_STATS.PATROL);
      }
      return;
    }

    if (currentState === 'Wait') {
      if (x < ZOMBIE_STATS.ATTACK_RANGE) {
        fsm.changeState(
          'Attack',
          this.player,
          [ZOMBIE_STATS.HIT, ZOMBIE_STATS.FRAME_ON_HIT],
          this.diseaseTarget
        );
        return;
      }
      if (y === 0 && x > ZOMBIE_STATS.ATTACK_RANGE) {
        fsm.changeState('Chase', this.player, ZOMBIE_STATS.CHASE);
        return;
      }
      return;
    }

    if (
      zombie.anims.isPlaying &&
      zombie.anims.currentAnim?.key === ENEMIES_ANIMATION.ZOMBIE.SIMPLE_ATTACK
    ) {
      return;
    } else if (x < ZOMBIE_STATS.ATTACK_RANGE) {
      if (currentState !== 'Attack') {
        fsm.changeState(
          'Attack',
          this.player,
          [ZOMBIE_STATS.HIT, ZOMBIE_STATS.FRAME_ON_HIT],
          this.diseaseTarget
        );
      }
    } else {
      if (currentState !== 'Chase') {
        fsm.changeState('Chase', this.player, ZOMBIE_STATS.CHASE);
      }
    }
  }

  protected get engageDistance(): number {
    return ZOMBIE_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return ZOMBIE_STATS.SAME_Y_THRESHOLD;
  }

  private diseaseTarget(): void {
    const player = this.player;
    const debuff = player.getDebuff();

    if (!debuff.isDebuffExist(DISEASE.id)) {
      debuff.addDebuff(DISEASE.id);
      debuff.startDebuff(DISEASE.id, player);
    }
  }
}
