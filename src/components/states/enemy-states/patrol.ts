import { CharacterState } from '@/components/states/core/character-state';
import { Character } from '@/objects/core/character';

export class Patrol extends CharacterState {
  private isWaiting = false;
  constructor(character: Character) {
    super('Patrol', character);
  }

  public onEnter(...args: unknown[]): void {}

  public onUpdate(delta: number): void {
    if (this.isWaiting) return;

    const posX = this.character.x;
    const leftX = this.character.getPatrolLeftX();
    const rightX = this.character.getPatrolRightX();
    const isFacingRight = this.character.getFacingRight();

    if (isFacingRight) {
      this.moveRight(this.characterMovement.getCurrentSpeed(delta));
      if (posX >= rightX) this.pausePatrol();
    } else {
      this.moveLeft(this.characterMovement.getCurrentSpeed(delta));
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
