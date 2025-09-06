import { isAnimationKeyExist } from '@/utils/helpers';
import { Movement } from '@/components/movement/movement';
import { Character } from '@/objects/core/character';
import { State, StateMachine } from '@/managers/state-machine';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { AnimationConfig } from '@/utils/types';
import { PLAYER_STATS } from '@/constants/object-stats';
import { SPELLS } from '@/constants/asset-keys';

export abstract class CharacterState implements State {
  readonly name: string;

  protected character: Character;
  protected characterBody: Phaser.Physics.Arcade.Body;
  protected move: Movement;
  protected input: KeyboardController | null = null;
  protected spellManager: SpellManager | null = null;
  protected ui: UiManager | null = null;
  protected animations: AnimationConfig;

  public stateMachine!: StateMachine;

  constructor(
    name: string,
    character: Character,
    input?: KeyboardController,
    spellManager?: SpellManager,
    ui?: UiManager
  ) {
    this.name = name;
    this.character = character;
    this.move = character.getMovement();
    this.input = input || null;
    this.spellManager = spellManager || null;
    this.ui = ui || null;

    this.characterBody = this.character.getArcadeBody();

    this.animations = this.character.getAnimations();
    if (
      !isAnimationKeyExist(
        this.animations.idle,
        this.animations.moveLeft,
        this.animations.moveRight,
        this.animations.attack,
        this.animations.death
      )
    ) {
      throw new Error('Missing animation keys');
    }
  }

  protected setToZeroVelocityX(): void {
    if (this.character.hasVelocity()) {
      this.character.setVelocityX(0);
    }
  }

  protected moveLeft(speed: number): void {
    this.character.setVelocityX(-speed);
    this.character.flipCharacterToRight(false);
    this.playAnimation(this.animations.moveLeft);
  }

  protected moveRight(speed: number): void {
    this.character.setVelocityX(speed);
    this.character.flipCharacterToRight(true);
    this.playAnimation(this.animations.moveRight);
  }

  protected jump(): void {
    if (this.characterBody.blocked.down) {
      this.character.setVelocityY(PLAYER_STATS.JUMP * -1);
    }
  }

  protected playAnimation(key: string | undefined, force = false): void {
    if (!key) return;
    if (!force && this.character.anims.currentAnim?.key === key) return;
    this.character.anims.play(key, true);
  }

  protected initToCastSpell(spell: string): void {
    if (!this.canTransitionToCast(spell)) return;
    this.stateMachine.changeState('Ready');
  }

  private canTransitionToCast(spell: string): boolean {
    if (this.name === 'Movement' && spell === SPELLS.FIRE_BALL) {
      return false;
    }

    if (!this.spellManager?.canCast(spell)) {
      return false;
    }

    return true;
  }

  onEnter?(): void {}
  onUpdate?(): void {}
  onExit?(): void {}
}
