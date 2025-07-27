import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';

export class Attack extends CharacterState {
  private player: Player | null = null;
  constructor(character: SkeletonWarrior) {
    super('Attack', character);
  }

  onEnter(...args: unknown[]): void {
    this.player = args[0] instanceof Player ? args[0] : null;
  }

  onUpdate(): void {
    if (!this.player || this.player.getDead()) {
      this.stateMachine.changeState('Patrol');
      return;
    }

    this.character.attack(this.player);
  }
}
