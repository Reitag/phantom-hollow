import { isArcadePhysicsBody } from '@/utils/helpers';
import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { Player } from '@/objects/characters/player/player';
import { State, StateMachine } from '@/managers/state-machine';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { SPELLS } from '@/utils/constants';

export abstract class PlayerState implements State {
  readonly name: string;

  protected player: Player;
  protected input: KeyboardController | null = null;
  protected spellManager: SpellManager | null = null;
  protected ui: UiManager | null = null;
  protected primaryActionName = SPELLS.FIREBALL;
  protected secondaryActionName = SPELLS.BLINK;

  public stateMachine!: StateMachine;

  constructor(
    name: string,
    player: Player,
    input?: KeyboardController,
    spellManager?: SpellManager,
    ui?: UiManager
  ) {
    this.name = name;
    this.player = player;
    this.input = input || null;
    this.spellManager = spellManager || null;
    this.ui = ui || null;
  }

  protected resetVelocity(): void {
    if (!isArcadePhysicsBody(this.player.body)) return;
    this.player.body.velocity.x = 0;
  }

  protected useMovement(): void {
    if (this.input?.isLeftDown) {
      this.player.moveLeft();
    } else if (this.input?.isRightDown) {
      this.player.moveRight();
    }
  }

  protected useJump(): void {
    if (this.input?.isUpPressed) {
      this.player.jump();
    }
  }

  protected changeToIdleState(): void {
    if (!isArcadePhysicsBody(this.player.body)) return;
    const isOnGround = this.player.body.blocked.down;

    if (isOnGround && !this.input?.isLeftDown && !this.input?.isRightDown) {
      this.stateMachine.changeState('Idle');
    }
  }

  protected initToCastSpell(spell: string): void {
    if (!this.canTransitionToCast(spell)) return;
    this.stateMachine.changeState('Ready');
  }

  private canTransitionToCast(spell: string): boolean {
    if (this.name === 'Movement' && spell === SPELLS.FIREBALL) {
      return false;
    }

    if (!this.spellManager?.canCast(spell)) {
      return false;
    }

    return true;
  }

  onEnter?(): void {}
  onUpdate?(): void {}
}
