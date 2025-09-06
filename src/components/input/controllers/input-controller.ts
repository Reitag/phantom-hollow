export abstract class InputController {
  protected left = false;
  protected right = false;
  protected up = false;
  protected down = false;

  protected upPressed = false;

  protected primaryActionDown = false;
  protected primaryActionReleased = false;

  protected secondaryActionDown = false;
  protected secondaryActionReleased = false;

  protected tertiaryActionDown = false;
  protected tertiaryActionReleased = false;

  get isLeftDown(): boolean {
    return this.left;
  }

  get isRightDown(): boolean {
    return this.right;
  }

  get isUpDown(): boolean {
    return this.up;
  }

  get isDownDown(): boolean {
    return this.down;
  }

  get isUpPressed(): boolean {
    return this.upPressed;
  }

  get isPrimaryActionDown(): boolean {
    return this.primaryActionDown;
  }

  get isPrimaryActionReleased(): boolean {
    return this.primaryActionReleased;
  }

  get isSecondaryActionDown(): boolean {
    return this.secondaryActionDown;
  }

  get isSecondaryActionReleased(): boolean {
    return this.secondaryActionReleased;
  }

  get isTertiaryActionDown(): boolean {
    return this.tertiaryActionDown;
  }

  get isTertiaryActionReleased(): boolean {
    return this.tertiaryActionReleased;
  }

  abstract update(): void;

  reset(): void {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.upPressed = false;
    this.primaryActionDown = false;
    this.primaryActionReleased = false;
    this.secondaryActionDown = false;
    this.secondaryActionReleased = false;
    this.tertiaryActionDown = false;
    this.tertiaryActionReleased = false;
  }
}
