import { PlayerState } from '@/components/states/characters/player-states/core/player-state';
import { Player } from '@/objects/characters/player/player';

export class Death extends PlayerState {
  constructor(player: Player) {
    super('Death', player);
    this.player = player;
  }

  onEnter(): void {}

  onUpdate(): void {}
}
