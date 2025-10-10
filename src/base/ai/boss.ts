import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';

export abstract class Boss {
  protected boss: Character;
  protected player: Player;

  constructor(boss: Character, player: Player) {
    this.boss = boss;
    this.player = player;
  }

  public abstract update(time: number, delta: number): void;

  public getBoss(): Character {
    return this.boss;
  }

  protected canEngage(range: number): boolean {
    if (!this.player || this.player.getDead()) return false;

    const distance = this.boss.x - this.player.x;

    if (distance <= range) {
      return true;
    }
    return false;
  }
}
