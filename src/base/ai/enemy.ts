import { Character } from '@/base/objects/character';
import { DESTROY_TIME, RESPAWN_TIME } from '@/constants/spawn-positions';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { StateMachine } from '@/systems/state-machine';
import { Position, SpawnPoint } from '@/utils/types';

export abstract class Enemy {
  protected enemies: Character[] = [];
  protected spawnMap = new Map<Character, SpawnPoint>();
  protected player: Player;
  protected isRanged!: boolean;

  constructor(player: Player) {
    this.player = player;
  }

  public update(delta: number): void {
    this.enemies.forEach((enemy) => {
      if (enemy.getDead()) {
        this.removeEnemy(enemy);
        return;
      }

      this.updateAggro(enemy, delta);
      this.updateEnemyState(enemy, delta);
    });
  }

  public addEnemy(enemy: Character): void {
    this.enemies.push(enemy);
  }

  public removeEnemy(enemy: Character): void {
    this.enemies = this.enemies.filter((e) => e !== enemy);
    if (enemy.active) {
      enemy.scene.time.delayedCall(DESTROY_TIME, () => {
        const spawn = this.spawnMap.get(enemy);
        if (spawn) {
          this.spawnMap.delete(enemy);

          enemy.scene.time.delayedCall(RESPAWN_TIME, () => {
            spawn.isSpawned = false;
          });
        }
        enemy.destroy();
      });
    }
  }

  public despawnEnemy(enemy: Character): void {
    this.enemies = this.enemies.filter((e) => e !== enemy);
    this.spawnMap.delete(enemy);
    enemy.destroy();
  }

  public getEnemies(): Character[] {
    return this.enemies;
  }

  public getEnemyMap(): Map<Character, SpawnPoint> {
    return this.spawnMap;
  }

  public handleCollision(enemy: Character): void {
    const { x, y } = this.distanceToPlayer(enemy);

    if (!this.canEngage(enemy, x, y)) {
      enemy.flipCharacterToRight(!enemy.getFacingRight());
      return;
    }
  }

  protected abstract updateEnemyState(enemy: Character, delta: number): void;
  protected abstract chillBehaviour(enemy: Character, fsm: StateMachine): void;
  protected abstract aggroedBehaviour(enemy: Character, fsm: StateMachine): void;
  protected abstract get engageDistance(): number;
  protected abstract get sameYThreshold(): number;

  protected updateAggro(enemy: Character, delta: number): void {
    const aggro = enemy.getStats().aggro;
    if (!aggro) return;

    if (this.player.getDead()) aggro.reset();

    if (aggro.meter > 0) {
      aggro.decrease(delta);
    }

    const { x, y } = this.distanceToPlayer(enemy);
    const inRange = this.canEngage(enemy, x, y);
    const fsm = enemy.getStateMachine();

    if (!inRange && !aggro.isAggroed) {
      this.chillBehaviour(enemy, fsm);
      return;
    }

    if (inRange) aggro.increase(10);
    if (aggro.isAggroed) this.aggroedBehaviour(enemy, fsm);
  }

  protected distanceToPlayer(enemy: Character): Position {
    return {
      x: Math.abs(this.player.x - enemy.x),
      y: Math.abs(this.player.y - enemy.y),
    };
  }

  protected canEngage(enemy: Character, dx: number, dy: number): boolean {
    if (this.player.getDead()) return false;
    if (dx > this.engageDistance) return false;
    if (!this.isRanged) {
      if (dy > 0) return false;
    }
    if (!this.hasLineOfSight(enemy, this.player)) return false;
    return true;
  }

  private hasLineOfSight(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite): boolean {
    const collision = ServiceLocator.resolve(ServiceKeys.collision);

    const fromY = from.getCenter().y;
    const toY = to.getCenter().y;

    const ray = new Phaser.Geom.Line(from.x, fromY, to.x, toY);
    const points = ray.getPoints(10);

    for (const point of points) {
      if (collision?.isCollidingWithTile(point.x, point.y)) {
        return false;
      }
    }

    return true;
  }
}
