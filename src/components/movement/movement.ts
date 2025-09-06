export class Movement {
  private baseSpeed: number;
  private externalForce: number = 0;
  private speedModifiers: number[] = [];

  constructor(baseSpeed: number) {
    this.baseSpeed = baseSpeed;
  }

  public addModifier(modifier: number): void {
    if (!this.speedModifiers.find((m) => m === modifier)) {
      this.speedModifiers.push(modifier);
    }
  }

  public removeAllModifiers(): void {
    if (this.speedModifiers.length > 0) {
      this.speedModifiers.length = 0;
    }
  }

  public applyForce(force: number): void {
    this.externalForce += force;
  }

  public getCurrentSpeed(): number {
    const totalMultiplier = this.speedModifiers.reduce((acc, m) => acc + m, 1);
    const finalSpeed = (this.baseSpeed + this.externalForce) * totalMultiplier;
    if (this.externalForce != 0) {
      this.reduceExternalForce();
    }
    return finalSpeed;
  }

  private reduceExternalForce(): void {
    this.externalForce *= 0.97;

    if (Math.abs(this.externalForce) < 20) {
      this.externalForce = 0;
    }
  }
}
