import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Border } from '@/utils/types';

const ENABLE_DEBUGGING = false;

export class Patrol extends CharacterState {
  private graphicks!: Phaser.GameObjects.Graphics;
  private isWaiting = false;
  private isPatroling = true;

  private walkBound!: number;

  private initX: number;
  private initY: number;

  private leftX!: number;
  private rightX!: number;

  constructor(character: Character) {
    super('Patrol', character);

    this.initX = character.x;
    this.initY = character.y;
  }

  public onEnter(...args: unknown[]): void {
    const walkBound = args.find((elem): elem is number => typeof elem === 'number');
    if (!walkBound) throw new Error('Walk bound value must be a number');

    this.walkBound = walkBound;

    this.leftX = this.initX - this.walkBound;
    this.rightX = this.initX + this.walkBound;
  }

  public onUpdate(delta: number): void {
    if (this.isWaiting) return;
    this.characterSpeed?.update(delta);

    if (this.initY !== this.character.y && this.isPatroling) {
      this.isPatroling = false;
    } else if (this.initY !== this.character.y && !this.isPatroling) {
      this.initX = this.calculateNewX();
      this.initY = this.character.y;
      this.leftX = this.initX - this.walkBound;
      this.rightX = this.initX + this.walkBound;
    } else if (Math.abs(this.initX - this.character.x) > 2 && !this.isPatroling) {
      if (this.character.x < this.initX) {
        this.moveRight(this.characterSpeed?.velocity);
      } else if (this.character.x > this.initX) {
        this.moveLeft(this.characterSpeed?.velocity);
      }
    } else if (Math.abs(this.initX - this.character.x) <= 2 && !this.isPatroling) {
      this.isPatroling = true;
    }

    const isFacingRight = this.character.getFacingRight();

    const posX = this.character.x;

    if (isFacingRight) {
      this.moveRight(this.characterSpeed?.velocity);
      if (posX >= this.rightX) this.pausePatrol();
    } else {
      this.moveLeft(this.characterSpeed?.velocity);
      if (posX <= this.leftX) this.pausePatrol();
    }
  }

  public onExit(): void {
    this.isPatroling = false;
  }

  private pausePatrol(): void {
    this.playAnimation(this.animations.idle);
    this.setToZeroVelocityX();
    this.isWaiting = true;

    this.character.scene.time.delayedCall(1000, () => {
      this.character.toggleFacingDirection();
      this.isWaiting = false;
    });
  }

  private calculateNewX(): number {
    const collision = ServiceLocator.resolve(ServiceKeys.collision);
    const bounds = this.character.getBounds();

    const checkY = bounds.bottom + 2;
    const step = 4;
    const maxDistance = 1000;

    let right = 0;
    let left = 0;

    while (
      collision.isCollidingWithTile(bounds.right + right, checkY) && // still on ground
      !collision.isCollidingWithTile(bounds.right + right, bounds.centerY + 4) && // no wall
      right < maxDistance
    ) {
      right += step;
    }

    const rightBorder = bounds.right + right;

    while (
      collision.isCollidingWithTile(bounds.left - left, checkY) &&
      !collision.isCollidingWithTile(bounds.left - left, bounds.centerY + 4) &&
      left < maxDistance
    ) {
      left += step;
    }

    const leftBorder = bounds.left - left;

    const margin = (rightBorder - leftBorder) * 0.3;

    const minX = leftBorder + margin;
    const maxX = rightBorder - margin;

    const newX = Phaser.Math.Between(minX, maxX);

    if (ENABLE_DEBUGGING) {
      this.graphickDebugg(
        bounds,
        { left: leftBorder, center: newX, right: rightBorder },
        { left: left, center: checkY, right: right }
      );
    }

    return newX;
  }

  private graphickDebugg(bounds: Phaser.Geom.Rectangle, borders: Border, distance: Border): void {
    if (this.graphicks) {
      this.graphicks.clear();
    }

    this.graphicks = this.character.scene.add.graphics().setDepth(2000);
    this.graphicks.lineStyle(1, 0x00ff00, 1);

    // Right red
    this.graphicks.fillStyle(0x00ff00, 0.3);
    this.graphicks.fillRect(bounds.right + distance.right, distance.center, 2, 2);

    this.graphicks.lineStyle(2, 0xff0000, 1);
    this.graphicks.beginPath();
    this.graphicks.moveTo(borders.right, bounds.centerY);
    this.graphicks.lineTo(borders.right, bounds.bottom);
    this.graphicks.strokePath();

    // Left blue
    this.graphicks.fillStyle(0x00ff00, 0.3);
    this.graphicks.fillRect(bounds.left - distance.left, distance.center, 2, 2);

    this.graphicks.lineStyle(2, 0x0000ff, 1);
    this.graphicks.beginPath();
    this.graphicks.moveTo(borders.left, bounds.centerY);
    this.graphicks.lineTo(borders.left, bounds.bottom);
    this.graphicks.strokePath();

    // Center yellow
    this.graphicks.lineStyle(2, 0xffff00, 1);
    this.graphicks.beginPath();
    this.graphicks.moveTo(borders.center, bounds.centerY);
    this.graphicks.lineTo(borders.center, bounds.bottom);
    this.graphicks.strokePath();

    this.character.scene.time.delayedCall(5000, () => this.graphicks.destroy());
  }
}
