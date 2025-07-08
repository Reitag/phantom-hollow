import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { Player } from '@/objects/characters/player/player';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { SPELLS } from '@/utils/constants';

export class InputHandler {
  private input: KeyboardController;
  private primaryActionName: string;
  private secondaryActionName: string;

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private spellManager: SpellManager,
    private ui: UiManager
  ) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input not available yet.');
    }

    this.input = new KeyboardController(keyboard);
    this.primaryActionName = SPELLS.FIREBALL;
    this.secondaryActionName = SPELLS.BLINK;

    this.setupCastingInterrupt();
  }

  update(): void {
    if (this.player.getDead()) return;

    this.input.update();

    this.useMovement();
    this.useJump();
    this.usePrimaryAction();
    this.useSecondaryAction();
  }

  private setupCastingInterrupt(): void {
    this.player.on('animationupdate', () => {
      if (
        (this.input.isLeftDown || this.input.isRightDown || this.input.isUpDown) &&
        this.player.getIsCasting()
      ) {
        this.player.playerStopCasting();
      }
    });
  }

  private useMovement(): void {
    if (this.input.isLeftDown) {
      this.player.moveLeft();
    } else if (this.input.isRightDown) {
      this.player.moveRight();
    } else {
      this.player.idle();
    }
  }

  private useJump(): void {
    if (this.input.isUpPressed) {
      this.player.jump();
    }
  }

  private usePrimaryAction(): void {
    if (!this.spellManager.canCast(this.primaryActionName)) return;

    if (this.input.isPrimaryActionDown) {
      this.ui.highlightSpell(this.primaryActionName);
    } else if (this.input.isPrimaryActionReleased) {
      this.ui.removeHighlight();
      this.player.primarySpell();
    }
  }

  private useSecondaryAction(): void {
    if (!this.spellManager.canCast(this.secondaryActionName)) return;

    if (this.input.isSecondaryActionDown) {
      this.ui.highlightSpell(this.secondaryActionName);
    } else if (this.input.isSecondaryActionReleased) {
      this.ui.removeHighlight();
      this.player.secondarySpell();
    }
  }
}
