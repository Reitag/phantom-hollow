import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';
import { Position } from '@/utils/types';

const ENGAGE_DISTANCE = 400;
const ATTACK_RANGE = 20;
const SAME_Y_THRESHOLD = 40;
const FRAME_ON_HIT = 4;

export class AiSkeletonWarrior {
  private skeletons: SkeletonWarrior[] = [];
  private player: Player;
  private collisionLayer: Phaser.Tilemaps.TilemapLayer | null;

  constructor(player: Player, collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
    this.player = player;
    this.collisionLayer = collisionLayer;
  }

  public update(): void {
    this.skeletons.forEach((skeleton) => {
      if (skeleton.getDead()) return;
      this.updateSkeletonState(skeleton);
    });
  }

  public addSkeleton(skeleton: SkeletonWarrior): void {
    this.skeletons.push(skeleton);
  }

  public getSkeletons(): SkeletonWarrior[] {
    return this.skeletons;
  }

  public handleLayerCollision(skeleton: SkeletonWarrior): void {
    const { x, y } = this.distanceToPlayer(skeleton);

    if (!this.canEngage(skeleton, x, y)) {
      skeleton.flipCharacterToRight(!skeleton.getFacingRight());
      return;
    }

    const fsm = skeleton.getStateMachine();
    if (y < SAME_Y_THRESHOLD && fsm.currentStateName !== 'Wait') {
      fsm.changeState('Wait');
    }
  }

  private updateSkeletonState(skeleton: SkeletonWarrior): void {
    skeleton.update();

    const { x, y } = this.distanceToPlayer(skeleton);
    const fsm = skeleton.getStateMachine();
    const currentState = fsm.currentStateName;

    const canEngage = this.canEngage(skeleton, x, y);

    if (!canEngage) {
      if (currentState !== 'Patrol') {
        fsm.changeState('Patrol');
      }
      return;
    }

    if (currentState === 'Wait') {
      if (x < ATTACK_RANGE) {
        fsm.changeState('Attack', this.player, FRAME_ON_HIT);
        return;
      }
      if (y === 0) {
        fsm.changeState('Chase', this.player);
        return;
      }
      return;
    }

    if (x < ATTACK_RANGE) {
      if (currentState !== 'Attack') {
        fsm.changeState('Attack', this.player, FRAME_ON_HIT);
      }
    } else {
      if (currentState !== 'Chase') {
        fsm.changeState('Chase', this.player);
      }
    }
  }

  private distanceToPlayer(skeleton: SkeletonWarrior): Position {
    return {
      x: Math.abs(this.player.x - skeleton.x),
      y: Math.abs(this.player.y - skeleton.y),
    };
  }

  private canEngage(skeleton: SkeletonWarrior, dx: number, dy: number): boolean {
    if (this.player.getDead()) return false;
    if (dx > ENGAGE_DISTANCE) return false;
    if (dy > SAME_Y_THRESHOLD) return false;
    if (!this.hasLineOfSight(skeleton, this.player)) return false;
    return true;
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
