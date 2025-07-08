import Phaser from 'phaser';

import { InputController } from '@/components/input/controllers/input-controller';

export class KeyboardController extends InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private primaryKey: Phaser.Input.Keyboard.Key;
  private secondaryKey: Phaser.Input.Keyboard.Key;

  constructor(input: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();
    this.cursors = input.createCursorKeys();
    this.primaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.secondaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  override update(): void {
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
  }
}
