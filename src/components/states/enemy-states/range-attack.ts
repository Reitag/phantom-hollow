import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class RangeAttack extends CharacterState {
  private player: Player | null = null;
  private frameOnHit!: number;
  private launchProjectile!: (character: Character) => void | undefined;

  constructor(character: Character) {
    super(ENEMY_STATES.RANGE_ATTACK, character);
  }

  public onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const frameOnHit = args.find((elem): elem is number => typeof elem === 'number');
    if (!frameOnHit) throw new Error('Frame on hit value must be a number');

    const launchProjectile = args.find(
      (elem): elem is (character: Character) => void => typeof elem === 'function'
    );
    if (launchProjectile) this.launchProjectile = launchProjectile;

    this.player = player;
    this.frameOnHit = frameOnHit;
    this.character.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableLaunch, this);
  }

  public onUpdate(delta: number): void {
    if (!this.player) return;

    this.characterSpeed?.update(delta);

    const animKey = this.chooseAttackAnimation();
    this.playAnimation(animKey);

    const direction = this.character.x > this.player.x ? -1 : 1;
    this.character.setFlipX(direction < 0);

    this.character.setVelocityX(direction * (this.characterSpeed?.velocity ?? 0));
  }

  public onExit(): void {
    this.character.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableLaunch, this);
  }

  private chooseAttackAnimation(): string | undefined {
    if (!this.player) return;

    const dy = this.player.y - this.character.y;

    if (dy < -50) {
      return this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.RANGED_UPPER_ATTACK);
    } else if (dy > 50) {
      return this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.RANGED_DOWN_ATTACK);
    } else {
      return this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.RANGED_STRAIGHT_ATTACK);
    }
  }

  private enableLaunch(
    anim: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame
  ): void {
    if (frame.index === this.frameOnHit && this.launchProjectile) {
      this.launchProjectile(this.character);
    }
  }
}
