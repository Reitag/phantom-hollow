import { BaseState } from '@/components/states/characters-states/base-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';

export class IdleState extends BaseState {
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
