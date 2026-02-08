import Phaser from 'phaser';

import { InputController } from '@/base/input/input-controller';
import { SLOT_KEYS_CODES } from '@/constants/key-bindings';
import { KeyBindingsService } from '@/infrastructure/keybinds-service';

export class KeyboardController extends InputController {
  // Key bindins
  private keyBindins: KeyBindingsService;

  // Movement
  private leftKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private jumpKey: Phaser.Input.Keyboard.Key;

  // Action / Utility
  private actionKey: Phaser.Input.Keyboard.Key;
  private utilityKey: Phaser.Input.Keyboard.Key;

  private slotKeys: Phaser.Input.Keyboard.Key[];

  constructor(input: Phaser.Input.Keyboard.KeyboardPlugin, slotCount = SLOT_KEYS_CODES.length) {
    super(slotCount);

    // Key bindins
    this.keyBindins = new KeyBindingsService(slotCount);

    // Movement
    this.leftKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.downKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.jumpKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.slotKeys = SLOT_KEYS_CODES.map(({ code, label }, index) => {
      this.actionSlotLabels[index] = label;
      return input.addKey(code);
    });

    // Action / interact / utility
    this.actionKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.utilityKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  public get keys(): KeyBindingsService {
    return this.keyBindins;
  }

  public override update(): void {
    if (this.disabled) return;

    // Movement
    this.movement.left = this.leftKey.isDown;
    this.movement.right = this.rightKey.isDown;
    this.movement.down = this.downKey.isDown;
    this.movement.upPressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);

    // Action / Utility
    this.actionDown = Phaser.Input.Keyboard.JustDown(this.actionKey);
    this.utilityDown = this.utilityKey.isDown;

    // Slots
    this.slotKeys.forEach((key, index) => {
      this.actionSlotsDown[index] = key.isDown;
      this.actionSlotsReleased[index] = Phaser.Input.Keyboard.JustUp(key);
    });
  }
}
