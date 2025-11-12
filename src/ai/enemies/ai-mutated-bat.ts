import { MUTATED_BAT_STATS } from '@/constants/object-stats';
import { ENEMY_STATES } from '@/constants/state-keys';
import { MutatedBat } from '@/entities/characters/enemies/mutated-bat';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { StateMachine } from '@/systems/state-machine';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { playAnimation } from '@/utils/helpers';
import { Enemy } from '../../base/ai/enemy';

export class AiMutatedBat extends Enemy {
  private orbitAngle = 0; // current angle of the bat around the player
  private orbitRadius = 100; // distance from player
  private orbitSpeed = 0.005; // how fast the bat circles
  private verticalOffset = 100; // how high above the player's head

  protected updateEnemyState(bat: MutatedBat, delta: number): void {
    if (!bat.active) {
      this.removeEnemy(bat);
      return;
    }
    if (bat.explodeCallback === undefined) {
      bat.explodeCallback = (self) => this.explode(self);
    }

    bat.update(delta);

    //if (bat.getDead()) return;
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

    if (currentState === ENEMY_STATES.DIVE) return;

    if (currentState !== ENEMY_STATES.HOVER) {
      fsm.changeState(ENEMY_STATES.HOVER, this.player, [
        this.orbitAngle,
        this.orbitRadius,
        this.orbitSpeed,
        this.verticalOffset,
      ]);

      bat.scene.time.delayedCall(MUTATED_BAT_STATS.DELAY, () => {
        if (bat.active) {
          fsm.changeState(ENEMY_STATES.DIVE, this.player, [
            MUTATED_BAT_STATS.CHASE,
            MUTATED_BAT_STATS.HIT,
            MUTATED_BAT_STATS.LIFE_TIME,
          ]);
        }
      });
    }
  }

  // Unused abstract functions
  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {}
  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {}

  protected get engageDistance(): number {
    return 0;
  }

  protected get sameYThreshold(): number {
    return 0;
  }

  private explode(bat: Character): void {
    bat.getStats()?.speed?.setMovementLock(true);

    const animKey = bat.resolveAnimation(CHARACTER_ANIMATION_KEYS.DEATH);
    playAnimation(bat, animKey);
    bat.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      bat.destroy();
    });
  }
}
