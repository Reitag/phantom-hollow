import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { CharacterState } from '@/components/states/characters/core/character-state';
import { SpellManager } from '@/managers/spell-manager';
import { Player } from '@/objects/characters/player/player';
import { SPELLS, VELOCITY } from '@/utils/constants';

export class Movement extends CharacterState {
  constructor(character: Player, input?: KeyboardController, spellManager?: SpellManager) {
    super('Movement', character, input, spellManager);
  }

  onEnter(...args: unknown[]): void {
    if (this.input?.isUpPressed) {
      this.jump();
    }
  }

  onUpdate(): void {
    this.movement();

    if (!this.input?.isLeftDown && !this.input?.isRightDown) {
      this.changeToIdleState();
    }

    if (this.input?.isUpPressed) {
      this.jump();
    }

    if (this.input?.isPrimaryActionDown) {
      this.initToCastSpell(SPELLS.FIREBALL);
    }

    if (this.input?.isSecondaryActionDown) {
      this.initToCastSpell(SPELLS.BLINK);
    }
  }

  private changeToIdleState(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState('Idle');
    }
  }

  private movement(): void {
    const speed = VELOCITY.PLAYER_VELOCITY.MOVE;

    if (this.input?.isLeftDown) {
      this.moveLeft(speed);
    } else if (this.input?.isRightDown) {
      this.moveRight(speed);
    } else {
      this.character.setVelocityX(0);
    }
  }
}
