import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export abstract class Enemy {
  protected enemies: Character[] = [];
  protected player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public update(delta: number): void {
    this.enemies.forEach((enemy) => {
      if (enemy.getDead()) {
        this.removeEnemy(enemy);
        return;
      }
      this.updateEnemyState(enemy, delta);
    });
  }

  public addEnemy(enemy: Character): void {
    this.enemies.push(enemy);
  }

  public removeEnemy(enemy: Character): void {
    this.enemies = this.enemies.filter((e) => e !== enemy);
  }

  public getEnemies(): Character[] {
    return this.enemies;
  }

  public handleCollision(enemy: Character): void {
    const { x, y } = this.distanceToPlayer(enemy);

    if (!this.canEngage(enemy, x, y)) {
      enemy.flipCharacterToRight(!enemy.getFacingRight());
      return;
    }

    /*const fsm = enemy.getStateMachine();
    if (y < this.sameYThreshold && fsm.currentStateName !== 'Wait') {
      fsm.changeState('Wait');
    }*/
  }

  protected abstract updateEnemyState(enemy: Character, delta: number): void;
  protected abstract get engageDistance(): number;
  protected abstract get sameYThreshold(): number;

  protected distanceToPlayer(enemy: Character): Position {
    return {
      x: Math.abs(this.player.x - enemy.x),
      y: Math.abs(this.player.y - enemy.y),
    };
  }

  protected canEngage(enemy: Character, dx: number, dy: number): boolean {
    if (this.player.getDead()) return false;
    if (dx > this.engageDistance) return false;
    if (dy > 0) return false;
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
