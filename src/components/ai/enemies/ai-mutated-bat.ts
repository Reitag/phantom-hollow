import { MUTATED_BAT_STATS, SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { MutatedBat } from '@/objects/characters/enemies/mutated-bat';
import { Ai } from '../core/ai';

export class AiMutatedBat extends Ai {
  private orbitAngle = 0; // current angle of the bat around the player
  private orbitRadius = 100; // distance from player
  private orbitSpeed = 0.05; // how fast the bat circles
  private verticalOffset = 100; // how high above the player's head

  protected updateEnemyState(bat: MutatedBat): void {
    if (!bat.active) {
      this.removeEnemy(bat);
      return;
    }

    bat.update();

    if (!this.player || this.player.getDead()) {
      bat.setVelocity(0, 0);
    }

    if (this.player.x > bat.x) {
      bat.flipCharacterToRight(true);
    } else {
      bat.flipCharacterToRight(false);
    }

    const fsm = bat.getStateMachine();
    const currentState = fsm.currentStateName;

    if (currentState === 'Dive') return;

    if (currentState !== 'Hover') {
      fsm.changeState('Hover', this.player, [
        this.orbitAngle,
        this.orbitRadius,
        this.orbitSpeed,
        this.verticalOffset,
      ]);

      bat.scene.time.delayedCall(8000, () => {
        fsm.changeState('Dive', this.player, [
          MUTATED_BAT_STATS.CHASE,
          MUTATED_BAT_STATS.HIT,
          MUTATED_BAT_STATS.LIFE_TIME,
        ]);
      });
    }
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
