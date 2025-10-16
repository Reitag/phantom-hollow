import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';

export class Patrol extends CharacterState {
  private isWaiting = false;
  private posX!: number;
  private leftX!: number;
  private rightX!: number;

  constructor(character: Character) {
    super('Patrol', character);
  }

  public onEnter(...args: unknown[]): void {
    /*const walkBound = args.find((elem): elem is number => typeof elem === 'number');
    if (!walkBound) throw new Error('Walk bound value must be a number');

    this.posX = this.character.x;
    this.leftX = this.character.x - walkBound;*/
  }

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
