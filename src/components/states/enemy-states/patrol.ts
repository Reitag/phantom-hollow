import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Border } from '@/utils/types';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

const ENABLE_DEBUGGING = false;

export class Patrol extends CharacterState {
  private graphicks!: Phaser.GameObjects.Graphics;
  private isWaiting = false;
  private isPatroling = true;

  private rightBorder: number | undefined = undefined;
  private leftBorder: number | undefined = undefined;

  private preservedWalkBound: number | undefined = undefined;
  private walkBound!: number;

  private initX: number;
  private initY: number;

  private leftX!: number;
  private rightX!: number;

  constructor(character: Character) {
    super(ENEMY_STATES.PATROL, character);

    this.initX = character.x;
    this.initY = character.y;
  }

  public onEnter(...args: unknown[]): void {
    const walkBound = args.find((elem): elem is number => typeof elem === 'number');
    if (!walkBound) throw new Error('Walk bound value must be a number');

    if (this.preservedWalkBound === undefined) {
      this.preservedWalkBound = walkBound;
      this.walkBound = walkBound;
    } else {
      this.walkBound = this.preservedWalkBound;
    }

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
    this.preservedWalkBound = this.walkBound;
  }

  private pausePatrol(): void {
    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
    this.playAnimation(animKey);

    this.setToZeroVelocityX();
    this.isWaiting = true;

    this.character.scene.time.delayedCall(1000, () => {
      this.flipCharacterToRight(!this.character.getFacingRight());
      this.isWaiting = false;
    });
  }

  private calculateNewX(): number {
    const collision = ServiceLocator.resolve(ServiceKeys.collision);
    const bounds = this.character.getBounds();

    const checkY = bounds.bottom + 2;
    const step = 1;
    const maxDistance = 1000;
    const halfWidth = bounds.width / 2;

    let right = 0;
    let left = 0;

    while (
      collision.isCollidingWithTile(bounds.right + right, checkY) &&
      !collision.isCollidingWithTile(bounds.right + right, bounds.centerY + 4) &&
      right < maxDistance
    ) {
      right += step;
    }

    while (
      collision.isCollidingWithTile(bounds.left - left, checkY) &&
      !collision.isCollidingWithTile(bounds.left - left, bounds.centerY + 4) &&
      left < maxDistance
    ) {
      left += step;
    }

    this.rightBorder = bounds.right + right - halfWidth;
    this.leftBorder = bounds.left - left + halfWidth;

    const space = this.rightBorder - this.leftBorder;

    let newX: number;

    if (space < 50) {
      this.walkBound = 0;
      newX = (this.leftBorder + this.rightBorder) / 2;
      if (ENABLE_DEBUGGING) {
        this.graphickDebugg(
          bounds,
          { left: this.leftBorder, center: newX, right: this.rightBorder },
          { left, center: checkY, right }
        );
      }
      return newX;
    }

    let margin: number;

    if (space < 160) {
      this.walkBound = 10;
      margin = Math.min(space * 0.3, 16);
    } else {
      this.walkBound = this.preservedWalkBound ?? 0;
      margin = space * 0.3;
    }

    const minX = this.leftBorder + margin;
    const maxX = this.rightBorder - margin;

    newX = Phaser.Math.Between(minX, maxX);

    if (ENABLE_DEBUGGING) {
      this.graphickDebugg(
        bounds,
        { left: this.leftBorder, center: newX, right: this.rightBorder },
        { left, center: checkY, right }
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
