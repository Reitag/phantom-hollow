import { CharacterState } from '@/components/states/characters/core/character-state';
import { Character } from '@/objects/core/character';

export class Patrol extends CharacterState {
  private isWaiting = false;
  private patrol!: number;
  constructor(character: Character) {
    super('Patrol', character);
  }

  onEnter(...args: unknown[]): void {
    const patrol = args.find((elem): elem is number => typeof elem === 'number');
    if (patrol === undefined) throw new Error('Expected numeric patrol argument');

    this.patrol = patrol;

    if (this.character.getFacingRight()) {
      this.moveRight(this.patrol);
    } else {
      this.moveLeft(this.patrol);
    }
  }

  onUpdate(): void {
    if (this.isWaiting) return;

    const posX = this.character.x;
    const leftX = this.character.getPatrolLeftX();
    const rightX = this.character.getPatrolRightX();
    const isFacingRight = this.character.getFacingRight();

    if (isFacingRight) {
      this.moveRight(this.patrol);
      if (posX >= rightX) this.pausePatrol();
    } else {
      this.moveLeft(this.patrol);
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
