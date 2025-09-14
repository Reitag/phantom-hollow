export class Movement {
  private baseSpeed: number;
  private savedBaseSpeed: number | null = null;
  private externalForce: number = 0;
  private speedModifiers: number[] = [];

  private static readonly FORCE_DECAY = 0.97;
  private static readonly MIN_FORCE_THRESHOLD = 20;

  constructor(baseSpeed: number) {
    this.baseSpeed = baseSpeed;
  }

  public addModifier(modifier: number): void {
    if (!this.speedModifiers.includes(modifier)) {
      this.speedModifiers.push(modifier);
    }
  }

  public removeModifier(modifier: number): void {
    this.speedModifiers = this.speedModifiers.filter((m) => m !== modifier);
  }

  public clearModifiers(): void {
    this.speedModifiers.length = 0;
  }

  public applyForce(force: number): void {
    this.externalForce += force;
  }

  public setMovementLock(isLocked: boolean): void {
    if (isLocked && this.savedBaseSpeed === null) {
      this.savedBaseSpeed = this.baseSpeed;
      this.baseSpeed = 0;
    } else if (!isLocked && this.savedBaseSpeed !== null) {
      this.baseSpeed = this.savedBaseSpeed;
      this.savedBaseSpeed = null;
    }
  }

  public getCurrentSpeed(): number {
    const totalMultiplier = this.speedModifiers.reduce((acc, m) => acc + m, 1);
    const finalSpeed = (this.baseSpeed - this.externalForce) * totalMultiplier;

    if (this.externalForce != 0) {
      this.reduceExternalForce();
    }
    return finalSpeed;
  }

  private reduceExternalForce(): void {
    this.externalForce *= Movement.FORCE_DECAY;

    if (Math.abs(this.externalForce) < Movement.MIN_FORCE_THRESHOLD) {
      this.externalForce = 0;
    }
  }
}
