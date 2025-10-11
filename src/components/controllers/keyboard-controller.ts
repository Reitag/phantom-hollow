import Phaser from 'phaser';

import { InputController } from '@/base/input/input-controller';

export class KeyboardController extends InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private primaryKey: Phaser.Input.Keyboard.Key;
  private secondaryKey: Phaser.Input.Keyboard.Key;
  private tertiaryKey: Phaser.Input.Keyboard.Key;

  private firstItemKey: Phaser.Input.Keyboard.Key;
  private secondItemKey: Phaser.Input.Keyboard.Key;
  private thirdItemKey: Phaser.Input.Keyboard.Key;
  private fourthItemKey: Phaser.Input.Keyboard.Key;

  private storeTriggerKey: Phaser.Input.Keyboard.Key;

  private disabled = false;

  constructor(input: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();
    this.cursors = input.createCursorKeys();

    this.primaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.secondaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.tertiaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    this.firstItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.secondItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.thirdItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.fourthItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.storeTriggerKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  override update(): void {
    if (this.disabled) return;

    // Movement keys
    this.left = this.cursors.left?.isDown ?? false;
    this.right = this.cursors.right?.isDown ?? false;
    this.up = this.cursors.up?.isDown ?? false;
    this.down = this.cursors.down?.isDown ?? false;

    this.upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    // Primary action
    this.primaryActionDown = this.primaryKey.isDown;
    this.primaryActionReleased = Phaser.Input.Keyboard.JustUp(this.primaryKey);

    // Secondary action
    this.secondaryActionDown = this.secondaryKey.isDown;
    this.secondaryActionReleased = Phaser.Input.Keyboard.JustUp(this.secondaryKey);

    // Tertiary action
    this.tertiaryActionDown = this.tertiaryKey.isDown;
    this.tertiaryActionReleased = Phaser.Input.Keyboard.JustUp(this.tertiaryKey);

    // Items
    this.firstItemUse = Phaser.Input.Keyboard.JustDown(this.firstItemKey);
    this.secondItemUse = Phaser.Input.Keyboard.JustDown(this.secondItemKey);
    this.thirdItemUse = Phaser.Input.Keyboard.JustDown(this.thirdItemKey);
    this.fourthItemUse = Phaser.Input.Keyboard.JustDown(this.fourthItemKey);

    // Store
    this.storeTrigger = Phaser.Input.Keyboard.JustDown(this.storeTriggerKey);
  }

  disable(): void {
    this.disabled = true;
  }
}
