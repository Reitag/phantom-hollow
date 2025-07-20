import { isArcadePhysicsBody } from '@/utils/helpers';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { State, StateMachine } from '@/managers/state-machine';

export abstract class BaseState implements State {
  protected character: SkeletonWarrior;
  public stateMachine!: StateMachine;
  readonly name: string;

  constructor(name: string, character: SkeletonWarrior) {
    this.name = name;
    this.character = character;
  }

  protected resetVelocity(): void {
    if (!isArcadePhysicsBody(this.character.body)) return;
    this.character.body.velocity.x = 0;
  }

  onEnter?(): void {}
  onUpdate?(): void {}
}
