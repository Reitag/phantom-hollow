import { Character } from '@/base/objects/character';
import { AUDIO } from '@/constants/asset-keys';
import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';
import { ENEMY_STATES, SHARED_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { StateMachine } from '@/systems/state-machine';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpawnPoint } from '@/utils/types';
import { Enemy, EnemyConfig } from '../../base/ai/enemy';

export class AiSkeletonWarrior extends Enemy {
  constructor(player: Player) {
    super(player);
    this.isRanged = false;
  }

  public addEnemy(skeleton: SkeletonWarrior, spawnPoint?: SpawnPoint): void {
    const enemy: EnemyConfig = {
      unit: skeleton,
      spawn: spawnPoint ?? null,
    };

    this.enemies.push(enemy);
  }

  protected updateEnemyState(skeleton: SkeletonWarrior, delta: number): void {
    skeleton.update(delta);

    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;
    if (currentState === SHARED_STATES.FREEZE) return;

    this.updateAggro(skeleton, delta);

    if (this.player.getDead()) return;

    const { x, y } = this.distanceToPlayer(skeleton);

    if (x < SKELETON_WARRIOR_STATS.ATTACK_RANGE && y < this.sameYThreshold) {
      if (currentState !== ENEMY_STATES.ATTACK) {
        fsm.changeState(
          ENEMY_STATES.ATTACK,
          this.player,
          [SKELETON_WARRIOR_STATS.HIT, SKELETON_WARRIOR_STATS.FRAME_ON_HIT],
          AUDIO.SWORD_IMPACT
        );
      }
    }
  }

  protected chillBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState === SHARED_STATES.FREEZE) return;

    if (currentState !== ENEMY_STATES.PATROL)
      fsm.changeState(ENEMY_STATES.PATROL, SKELETON_WARRIOR_STATS.WALK_BOUND);
  }

  protected aggroedBehaviour(enemy: Character, fsm: StateMachine): void {
    const currentState = fsm.currentStateName;
    if (currentState === SHARED_STATES.FREEZE) return;

    if (
      enemy.anims.isPlaying &&
      enemy.anims.currentAnim?.key === ENEMIES_ANIMATION.SKELETON_WARRIOR.ATTACK
    ) {
      return;
    }
    if (currentState === ENEMY_STATES.CHASE) return;

    const aggro = enemy.getStats().aggro;
    if (aggro && aggro.meter < 60) {
      const aggroSounds = [
        AUDIO.ENEMY_AGGRO_1,
        AUDIO.ENEMY_AGGRO_3,
        AUDIO.ENEMY_AGGRO_5,
        AUDIO.ENEMY_AGGRO_7,
        AUDIO.ENEMY_AGGRO_9,
      ];

      const randomSoundKey = Phaser.Utils.Array.GetRandom(aggroSounds);
      ServiceLocator.resolve(ServiceKeys.audio).play(randomSoundKey, {
        detune: Phaser.Math.Between(-150, 150),
      });
    }

    fsm.changeState(ENEMY_STATES.CHASE, this.player, SKELETON_WARRIOR_STATS.CHASE);
  }

  protected get engageDistance(): number {
    return SKELETON_WARRIOR_STATS.ENGAGE_DISTANCE;
  }

  protected get sameYThreshold(): number {
    return SKELETON_WARRIOR_STATS.SAME_Y_THRESHOLD;
  }
}
