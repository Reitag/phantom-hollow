import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { CollisionService } from '@/infrastructure/collision-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Chase extends CharacterState {
  private player: Player | null = null;
  private collision: CollisionService;
  private chase: number = 0;

  constructor(character: Character) {
    super(ENEMY_STATES.CHASE, character);

    this.collision = ServiceLocator.resolve(ServiceKeys.collision);
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

    if (this.ifCollision()) return;
    if (this.sameY()) return;

    const direction = this.character.x > this.player.x ? -1 : 1;
    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.MOVE);

    this.flipCharacterToRight(direction > 0);
    this.setVelocityToX(direction * (this.characterSpeed?.velocity ?? 0));
    this.playAnimation(animKey);
  }

  public onExit(): void {
    this.characterSpeed?.removeModifier('Chase-player');
  }

  private ifCollision(): boolean {
    if (!this.player) return false;
    const direction = this.character.x > this.player.x ? -1 : 1;

    if (
      this.collision.isEntityColliding(this.character) &&
      Math.abs(this.player.y - this.character.y) > 2
    ) {
      this.flipCharacterToRight(direction > 0);
      const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
      this.playAnimation(animKey, true);
      return true;
    }
    return false;
  }

  private sameY(): boolean {
    if (!this.player) return false;
    const direction = this.character.x > this.player.x ? -1 : 1;

    if (
      Math.abs(this.character.y - this.player.y) > 2 &&
      Math.abs(this.character.x - this.player.x) < 5
    ) {
      this.flipCharacterToRight(direction < 0);
      this.setToZeroVelocityX();
      const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
      this.playAnimation(animKey, true);
      return true;
    }
    return false;
  }
}
