import { CharacterState } from '@/components/states/characters/core/character-state';
import { Character } from '@/objects/core/character';

export class Patrol extends CharacterState {
  private isWaiting = false;
  constructor(character: Character) {
    super('Patrol', character);
  }

  onEnter(...args: unknown[]): void {
    if (this.character.getFacingRight()) {
      this.moveRight(60);
    } else {
      this.moveLeft(60);
    }
  }

  onUpdate(): void {
    if (this.isWaiting) return;

    const posX = this.character.x;
    const leftX = this.character.getPatrolLeftX();
    const rightX = this.character.getPatrolRightX();
    const isFacingRight = this.character.getFacingRight();

    if (isFacingRight) {
      this.moveRight(60);
      if (posX >= rightX) this.pausePatrol();
    } else {
      this.moveLeft(60);
      if (posX <= leftX) this.pausePatrol();
    }
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
}
