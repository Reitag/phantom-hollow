export abstract class InputController {
  protected actionSlotLabels: string[];
  protected disabled = false;

  protected movement = {
    left: false,
    right: false,
    down: false,
    upPressed: false,
  };

  protected actionDown = false;
  protected utilityDown = false;

  protected actionSlotsDown: boolean[] = [];
  protected actionSlotsReleased: boolean[] = [];

  constructor(protected slotCount: number) {
    this.actionSlotsDown = new Array(slotCount).fill(false);
    this.actionSlotsReleased = new Array(slotCount).fill(false);
    this.actionSlotLabels = new Array(slotCount).fill('');
  }

  get isLeftDown(): boolean {
    return this.movement.left;
  }

  get isRightDown(): boolean {
    return this.movement.right;
  }

  get isDownDown(): boolean {
    return this.movement.down;
  }

  get isUpPressed(): boolean {
    return this.movement.upPressed;
  }

  get isActionDown(): boolean {
    return this.actionDown;
  }

  get isUtilityDown(): boolean {
    return this.utilityDown;
  }

  public isSlotDown(index: number): boolean {
    return this.actionSlotsDown[index];
  }

  public isSlotReleased(index: number): boolean {
    return this.actionSlotsReleased[index];
  }

  public getSlotLabel(index: number): string {
    return this.actionSlotLabels[index] ?? '';
  }

  public reset(): void {
    Object.keys(this.movement).forEach((key) => {
      this.movement[key as keyof typeof this.movement] = false;
    });

    this.actionSlotsDown.fill(false);
    this.actionSlotsReleased.fill(false);
    this.actionDown = false;
    this.utilityDown = false;
  }

  public abstract update(): void;

  public disable(): void {
    this.disabled = true;
  }

  public enable(): void {
    this.disabled = false;
  }
}
