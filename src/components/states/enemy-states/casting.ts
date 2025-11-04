import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES, SHARED_STATES } from '@/constants/state-keys';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';

export class Casting extends CharacterState {
  private castSpell!: () => void | undefined;
  private duration: number | undefined;

  constructor(character: Character) {
    super(ENEMY_STATES.CASTING, character);
  }

  public onEnter(...args: unknown[]): void {
    const castSpell = args.find((elem): elem is () => void => typeof elem === 'function');
    if (castSpell) this.castSpell = castSpell;

    const duration = args.find((elem): elem is number => typeof elem === 'number');
    if (!duration) throw new Error('Duration must be a number');
    this.duration = duration;

    this.setToZeroVelocityX();
    this.characterSpeed?.setMovementLock(true);

    this.startCast();
  }

  public onUpdate(): void {}

  public onExit(): void {
    this.characterSpeed?.setMovementLock(false);
  }

  private startCast(): void {
    const animStartCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_START);
    const animMainCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN);
    const animEndCast = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.CAST.CAST_END);

    this.playAnimation(animStartCast, true);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animStartCast, () => {
      this.playAnimation(animMainCast, true);
    });

    this.character.scene.time.delayedCall(this.duration ?? 100, () => {
      if (this.character.active) {
        this.playAnimation(animEndCast);
        this.castSpell();

        this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animEndCast, () => {
          this.character.getStateMachine().changeState(SHARED_STATES.IDLE);
        });
      }
    });
  }
}
