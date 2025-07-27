import { isArcadePhysicsBody } from '@/utils/helpers';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';
import { State, StateMachine } from '@/managers/state-machine';
import { KeyboardController } from '@/components/input/controllers/keyboard-controller';

export abstract class CharacterState implements State {
  protected character: SkeletonWarrior | Player;
  protected input: KeyboardController | null = null;
  public stateMachine!: StateMachine;
  readonly name: string;

  constructor(name: string, character: SkeletonWarrior | Player) {
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
