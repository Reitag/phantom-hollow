import { Character } from '@/objects/core/character';
import { Player } from '@/objects/characters/player/player';
import { Position } from '@/utils/types';

export abstract class Ai {
  protected enemies: Character[] = [];
  protected player: Player;
  protected collisionLayer: Phaser.Tilemaps.TilemapLayer | null;

  constructor(player: Player, collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
    this.player = player;
    this.collisionLayer = collisionLayer;
  }

  public update(): void {
    this.enemies.forEach((enemy) => {
      if (enemy.getDead()) {
        this.removeEnemy(enemy);
        return;
      }
      this.updateEnemyState(enemy);
    });
  }

  public addEnemy(enemy: Character): void {
    this.enemies.push(enemy);
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

    const fsm = enemy.getStateMachine();
    if (y < this.sameYThreshold && fsm.currentStateName !== 'Wait') {
      fsm.changeState('Wait');
    }
  }

  protected abstract updateEnemyState(enemy: Character): void;
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
    if (dy > this.sameYThreshold) return false;
    if (!this.hasLineOfSight(enemy, this.player)) return false;
    return true;
  }

  protected removeEnemy(enemy: Character): void {
    this.enemies = this.enemies.filter((e) => e !== enemy);
  }

  private hasLineOfSight(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite): boolean {
    if (!this.collisionLayer) return true;

    const fromY = from.getCenter().y;
    const toY = to.getCenter().y;

    const ray = new Phaser.Geom.Line(from.x, fromY, to.x, toY);
    const points = ray.getPoints(10);

    for (const point of points) {
      const tile = this.collisionLayer.getTileAtWorldXY(point.x, point.y);
      if (tile && tile.collides) {
        return false;
      }
    }

    return true;
  }
}
