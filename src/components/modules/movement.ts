export class Movement {
  private baseSpeed: number | undefined;
  private savedBaseSpeed: number | null = null;
  private externalForce: number = 0;
  private speedModifiers: Map<string, number> = new Map();

  private static readonly FORCE_DECAY = 0.17;
  private static readonly MIN_FORCE_THRESHOLD = 20;

  constructor(baseSpeed: number | undefined) {
    this.baseSpeed = baseSpeed;
  }

  public addModifier(key: string, value: number): void {
    if (!this.speedModifiers.has(key)) {
      this.speedModifiers.set(key, value);
    }
  }

  public removeModifier(key: string): void {
    if (this.speedModifiers.has(key)) {
      this.speedModifiers.delete(key);
    }
  }

  public clearModifiers(): void {
    this.speedModifiers.clear();
  }

  public applyForce(force: number): void {
    this.externalForce += force;
  }

  public setMovementLock(isLocked: boolean): void {
    if (this.baseSpeed === undefined) return;

    if (isLocked && this.savedBaseSpeed === null) {
      this.savedBaseSpeed = this.baseSpeed;
      this.baseSpeed = 0;
    } else if (!isLocked && this.savedBaseSpeed !== null) {
      this.baseSpeed = this.savedBaseSpeed;
      this.savedBaseSpeed = null;
    }
  }

  public getCurrentSpeed(delta: number = 1): number {
    if (!this.baseSpeed) return 0;

    const totalMultiplier = this.speedModifiers.values().reduce((acc, m) => acc + m, 1);
    const finalSpeed = (this.baseSpeed - this.externalForce) * totalMultiplier;

    if (this.externalForce != 0) {
      this.reduceExternalForce(delta);
    }
    return finalSpeed;
  }

  private reduceExternalForce(delta: number): void {
    const deltaSeconds = delta / 1000;

    this.externalForce *= Math.pow(Movement.FORCE_DECAY, deltaSeconds);

    if (Math.abs(this.externalForce) < Movement.MIN_FORCE_THRESHOLD) {
      this.externalForce = 0;
    }
  }
}
