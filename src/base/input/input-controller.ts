export abstract class InputController {
  protected disabled = false;

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

  protected quaternaryActionDown = false;
  protected quaternaryActionReleased = false;

  protected firstItemUse = false;
  protected secondItemUse = false;
  protected thirdItemUse = false;
  protected fourthItemUse = false;

  protected actionDown = false;
  protected utilityDown = false;

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

  get isQuaternaryActionDown(): boolean {
    return this.quaternaryActionDown;
  }

  get isQuaternaryActionReleased(): boolean {
    return this.quaternaryActionReleased;
  }

  get isFirstItemDown(): boolean {
    return this.firstItemUse;
  }

  get isSecondItemDown(): boolean {
    return this.secondItemUse;
  }

  get isThirdItemDown(): boolean {
    return this.thirdItemUse;
  }

  get isFourthItemDown(): boolean {
    return this.fourthItemUse;
  }

  get isActionDown(): boolean {
    return this.actionDown;
  }

  get isUtilityDown(): boolean {
    return this.utilityDown;
  }

  abstract update(): void;

  public disable(): void {
    this.disabled = true;
  }

  public enable(): void {
    this.disabled = false;
  }

  public reset(): void {
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
    this.quaternaryActionDown = false;
    this.quaternaryActionReleased = false;
    this.firstItemUse = false;
    this.secondItemUse = false;
    this.thirdItemUse = false;
    this.fourthItemUse = false;
    this.actionDown = false;
    this.utilityDown = false;
  }
}
