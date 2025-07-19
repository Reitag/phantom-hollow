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

      const dx = Math.abs(this.player.x - skeleton.x);
      const dy = Math.abs(this.player.y - skeleton.y);

      const sameYLevel = dy < 40;

      const canSeePlayer = this.hasLineOfSight(skeleton, this.player);

      if (dx > 300) {
        skeleton.patrol();
        return;
      }

      if (sameYLevel && dx < 300 && canSeePlayer) {
        if (this.player.getDead()) {
          skeleton.patrol();
        } else if (dx < 20) {
          skeleton.attack(this.player);
        } else {
          skeleton.chase(this.player);
        }
      } else {
        skeleton.patrol();
      }
    });
  }

  addSkeleton(skeleton: SkeletonWarrior): void {
    this.skeletons.push(skeleton);
  }

  getSkeletons(): SkeletonWarrior[] {
    return this.skeletons;
  }

  hasLineOfSight(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite): boolean {
    if (!this.collisionLayer) return true;

    const fromY = from.y + from.height / 2;
    const toY = to.y + to.height / 2;

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
