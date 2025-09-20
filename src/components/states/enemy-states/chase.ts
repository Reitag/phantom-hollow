import { CharacterState } from '@/components/states/core/character-state';
import { Character } from '@/objects/core/character';
import { Player } from '@/objects/characters/player/player';

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
    this.characterMovement.addModifier('Chase-player', this.chase);
  }

  public onUpdate(): void {
    if (!this.player) return;

    const direction = this.character.x > this.player.x ? -1 : 1;
    const animKey = direction === 1 ? this.animations.moveRight : this.animations.moveLeft;

    this.character.setFlipX(direction < 0);
    this.character.setVelocityX(direction * this.characterMovement.getCurrentSpeed());
    this.playAnimation(animKey);
  }

  public onExit(): void {
    this.characterMovement.removeModifier('Chase-player');
  }
}
