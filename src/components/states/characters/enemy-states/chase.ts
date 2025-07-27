import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';

export class Chase extends CharacterState {
  private player: Player | null = null;
  constructor(character: SkeletonWarrior) {
    super('Chase', character);
  }

  onEnter(...args: unknown[]): void {
    this.player = args[0] instanceof Player ? args[0] : null;
  }

  onUpdate(): void {
    if (!this.player || this.player.getDead()) {
      this.stateMachine.changeState('Patrol');
      return;
    }

    const dx = Math.abs(this.player.x - this.character.x);
    if (dx < 20) {
      this.stateMachine.changeState('Attack', this.player);
      return;
    }

    this.character.chase(this.player);
  }
}
