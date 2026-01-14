import Phaser from 'phaser';

import { InputController } from '@/base/input/input-controller';

export class KeyboardController extends InputController {
  private leftKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private jumpKey: Phaser.Input.Keyboard.Key;

  private primaryKey: Phaser.Input.Keyboard.Key;
  private secondaryKey: Phaser.Input.Keyboard.Key;
  private tertiaryKey: Phaser.Input.Keyboard.Key;
  private quaternaryKey: Phaser.Input.Keyboard.Key;

  private actionKey: Phaser.Input.Keyboard.Key;
  private utilityKey: Phaser.Input.Keyboard.Key;

  /*private firstItemKey: Phaser.Input.Keyboard.Key;
  private secondItemKey: Phaser.Input.Keyboard.Key;
  private thirdItemKey: Phaser.Input.Keyboard.Key;
  private fourthItemKey: Phaser.Input.Keyboard.Key;*/

  constructor(input: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();

    // Movement
    this.leftKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.downKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.jumpKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // Abilities
    this.primaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.secondaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.tertiaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.quaternaryKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Action / interact / utility
    this.actionKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.utilityKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    /*this.firstItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.secondItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.thirdItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.fourthItemKey = input.addKey(Phaser.Input.Keyboard.KeyCodes.F);*/
  }

  public override update(): void {
    if (this.disabled) return;

    // Movement
    this.left = this.leftKey.isDown;
    this.right = this.rightKey.isDown;
    this.down = this.downKey.isDown;

    this.up = false; // no upward movement
    this.upPressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);

    // Primary action
    this.primaryActionDown = this.primaryKey.isDown;
    this.primaryActionReleased = Phaser.Input.Keyboard.JustUp(this.primaryKey);

    // Secondary action
    this.secondaryActionDown = this.secondaryKey.isDown;
    this.secondaryActionReleased = Phaser.Input.Keyboard.JustUp(this.secondaryKey);

    // Tertiary action
    this.tertiaryActionDown = this.tertiaryKey.isDown;
    this.tertiaryActionReleased = Phaser.Input.Keyboard.JustUp(this.tertiaryKey);

    // Quaternary action
    this.quaternaryActionDown = this.quaternaryKey.isDown;
    this.quaternaryActionReleased = Phaser.Input.Keyboard.JustUp(this.quaternaryKey);

    // Action / Utility
    this.actionDown = Phaser.Input.Keyboard.JustDown(this.actionKey);
    //this.utilityDown = Phaser.Input.Keyboard.JustDown(this.utilityKey);
    this.utilityDown = this.utilityKey.isDown;

    // Items
    /*this.firstItemUse = Phaser.Input.Keyboard.JustDown(this.firstItemKey);
    this.secondItemUse = Phaser.Input.Keyboard.JustDown(this.secondItemKey);
    this.thirdItemUse = Phaser.Input.Keyboard.JustDown(this.thirdItemKey);
    this.fourthItemUse = Phaser.Input.Keyboard.JustDown(this.fourthItemKey);*/
  }
}
