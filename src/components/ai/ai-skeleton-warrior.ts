import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';

export class AiSkeletonWarrior {
  private skeletons: SkeletonWarrior[] = [];
  private player: Player;
  private collisionLayer: Phaser.Tilemaps.TilemapLayer | null;

  constructor(player: Player, collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
    this.player = player;
    this.collisionLayer = collisionLayer;
  }

  update(): void {
    this.skeletons.forEach((skeleton) => {
      if (skeleton.getDead()) return;
      this.updateSkeletonState(skeleton);
    });
  }

  private updateSkeletonState(skeleton: SkeletonWarrior): void {
    skeleton.update();

    const dx = Math.abs(this.player.x - skeleton.x);
    const dy = Math.abs(this.player.y - skeleton.y);

    const isPlayerFar = dx > 300;
    const isSameYLevel = dy < 40;
    const canSeePlayer = this.hasLineOfSight(skeleton, this.player);

    const fsm = skeleton.getStateMachine();

    if (isPlayerFar || this.player.getDead() || !canSeePlayer || !isSameYLevel) {
      fsm.changeState('Patrol');
      return;
    }

    if (dx < 20) {
      fsm.changeState('Attack', this.player);
    } else {
      fsm.changeState('Chase', this.player);
    }
  }

  addSkeleton(skeleton: SkeletonWarrior): void {
    this.skeletons.push(skeleton);
  }

  getSkeletons(): SkeletonWarrior[] {
    return this.skeletons;
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
