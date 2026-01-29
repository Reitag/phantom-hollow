import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { PLAYER_STATES, SHARED_STATES } from '@/constants/state-keys';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { InventorySystem } from '@/systems/inventory-system';

export class Duck extends CharacterState {
  private characterKey: string;
  private duckFrame: string | number;

  // Original hitbox
  private originalWidth!: number;
  private originalHeight!: number;
  private originalOffsetX!: number;
  private originalOffsetY!: number;

  constructor(
    character: Character,
    input: KeyboardController,
    inventory: InventorySystem,
    characterKey: string,
    duckFrame: string | number
  ) {
    super(PLAYER_STATES.DUCK, character, input, undefined, undefined, inventory);
    this.characterKey = characterKey;
    this.duckFrame = duckFrame;
  }

  public onEnter(): void {
    this.characterSpeed?.setMovementLock(true);
    this.character.anims.pause();
    this.character.setTexture(this.characterKey, this.duckFrame);

    const body = this.character.getArcadeBody();
    this.originalWidth = body.width;
    this.originalHeight = body.height;
    this.originalOffsetX = body.offset.x;
    this.originalOffsetY = body.offset.y;

    const newHeight = Math.floor(this.originalHeight * 0.6); // 40% smaller
    body.setSize(this.originalWidth, newHeight);

    // Move offset down so it touches the ground
    body.setOffset(this.originalOffsetX, this.originalOffsetY + (this.originalHeight - newHeight));
  }

  public onUpdate(): void {
    if (!this.input?.isDownDown) {
      this.stateMachine.changeState(SHARED_STATES.IDLE);
    }
  }

  public onExit(): void {
    this.character.anims.resume();
    this.characterSpeed?.setMovementLock(false);

    const body = this.character.getArcadeBody();
    body.setSize(this.originalWidth, this.originalHeight);
    body.setOffset(this.originalOffsetX, this.originalOffsetY);
  }
}
