import { CharacterState } from '@/components/states/core/character-state';
import { Character } from '@/objects/core/character';

export class Casting extends CharacterState {
  private castSpell!: () => void | undefined;

  constructor(character: Character) {
    super('Casting', character);
  }

  public onEnter(...args: unknown[]): void {
    const castSpell = args.find((elem): elem is () => void => typeof elem === 'function');
    if (castSpell) this.castSpell = castSpell;

    this.playAnimation(this.animations.attack, true);

    this.character.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableCast, this);

    this.character.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.character.getStateMachine().changeState('Idle');
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
    if (anim.key !== this.animations.attack) return;

    if (frame.index === 10 && this.castSpell) {
      this.castSpell();
    }
  }
}
