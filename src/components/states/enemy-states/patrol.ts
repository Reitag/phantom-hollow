import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';

export class Patrol extends CharacterState {
  private isWaiting = false;
  constructor(character: Character) {
    super('Patrol', character);
  }

  public onEnter(...args: unknown[]): void {}

  public onUpdate(delta: number): void {
    if (this.isWaiting) return;

    this.characterSpeed?.update(delta);

    const posX = this.character.x;
    const leftX = this.character.getPatrolLeftX();
    const rightX = this.character.getPatrolRightX();
    const isFacingRight = this.character.getFacingRight();

    if (isFacingRight) {
      this.moveRight(this.characterSpeed?.velocity);
      if (posX >= rightX) this.pausePatrol();
    } else {
      this.moveLeft(this.characterSpeed?.velocity);
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
