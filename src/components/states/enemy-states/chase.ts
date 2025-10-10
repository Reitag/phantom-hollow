import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';

export class Chase extends CharacterState {
  private player: Player | null = null;
  private chase: number = 0;

  constructor(character: Character) {
    super('Chase', character);
  }

  public onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const chase = args.find((elem): elem is number => typeof elem === 'number');
    if (!chase) throw new Error('Chase value must be a number');

    this.player = player;
    this.chase = chase;
    this.characterSpeed?.addModifier('Chase-player', this.chase);
  }

  public onUpdate(delta: number): void {
    if (!this.player) return;

    this.characterSpeed?.update(delta);

    const direction = this.character.x > this.player.x ? -1 : 1;
    const animKey = direction === 1 ? this.animations.moveRight : this.animations.moveLeft;

    this.character.setFlipX(direction < 0);
    this.character.setVelocityX(direction * (this.characterSpeed?.velocity ?? 0));
    this.playAnimation(animKey);
  }

  public onExit(): void {
    this.characterSpeed?.removeModifier('Chase-player');
  }
}
