import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { DISEASE } from '@/constants/modifier-stats';
import { ZOMBIE_STATS } from '@/constants/object-stats';
import { Zombie } from '@/entities/characters/enemies/zombie';
import { Enemy } from '../../base/ai/enemy';

export class AiZombie extends Enemy {
  protected updateEnemyState(zombie: Zombie, delta: number): void {
    zombie.update(delta);

    const { x, y } = this.distanceToPlayer(zombie);
    const fsm = zombie.getStateMachine();
    const currentState = fsm.currentStateName;

    const canEngage = this.canEngage(zombie, x, y);

    if (!canEngage) {
      if (currentState !== 'Patrol') {
        fsm.changeState('Patrol');
      }
      return;
    }

    /*if (currentState === 'Wait') {
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
    }*/

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
    const debuff = player.getModifier();

    if (!debuff.isModifierExist(DISEASE.id)) {
      debuff.addModifier(DISEASE.id);
      debuff.startModifier(DISEASE.id, player);
    }
  }
}
