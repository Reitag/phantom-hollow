import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES, SHARED_STATES } from '@/constants/state-keys';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Casting extends CharacterState {
  private castSpell!: () => void | undefined;
  private frameOnCast: number | undefined;

  constructor(character: Character) {
    super(ENEMY_STATES.CASTING, character);
  }

  public onEnter(...args: unknown[]): void {
    const castSpell = args.find((elem): elem is () => void => typeof elem === 'function');
    if (castSpell) this.castSpell = castSpell;

    const frameonCast = args.find((elem): elem is number => typeof elem === 'number');
    if (!frameonCast) throw new Error('Frame on cast must be a number');
    this.frameOnCast = frameonCast;

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST);
    this.playAnimation(animKey, true);

    this.character.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableCast, this);

    this.character.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.character.getStateMachine().changeState(SHARED_STATES.IDLE);
      },
      this
    );
  }

  public onUpdate(): void {}

  public onExit(): void {
    this.character.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableCast, this);
  }

  private enableCast(
    anim: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame
  ): void {
    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST);
    if (anim.key !== animKey) return;

    if (frame.index === this.frameOnCast && this.castSpell) {
      this.castSpell();
    }
  }
}
