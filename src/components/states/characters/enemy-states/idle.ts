import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class Idle extends CharacterState {
  constructor(character: SkeletonWarrior) {
    super('Idle', character);
  }

  onEnter(...args: unknown[]): void {
    this.character.idle();
  }

  onUpdate(): void {
    this.stateMachine.changeState('Patrol');
  }
}
