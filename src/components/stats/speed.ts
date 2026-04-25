export class Speed {
  private speed: number | undefined;
  private saved: number | undefined = undefined;
  private force: number = 0;
  private multipliers: Map<string, number> = new Map();

  private static readonly FORCE_DECAY = 0.17;
  private static readonly MIN_FORCE_THRESHOLD = 20;

  constructor(speed: number) {
    this.speed = speed;
  }

  public get velocity(): number {
    if (this.speed === undefined) return 0;

    const totalMultiplier = Array.from(this.multipliers.values()).reduce((acc, m) => acc * m, 1);
    const finalSpeed = this.speed * totalMultiplier;
    return finalSpeed - this.force;
  }

  public update(delta: number): void {
    if (this.force !== 0) {
      this.reduceForce(delta);
    }
  }

  public addModifier(key: string, value: number): void {
    if (!this.multipliers.has(key)) {
      this.multipliers.set(key, value);
    }
  }

  public removeModifier(key: string): void {
    if (this.multipliers.has(key)) {
      this.multipliers.delete(key);
    }
  }

  public clearModifiers(): void {
    this.multipliers.clear();
  }

  public applyForce(force: number): void {
    this.force += force;
  }

  public setMovementLock(isLocked: boolean): void {
    if (isLocked && this.saved === undefined) {
      this.saved = this.speed;
      this.speed = 0;
    } else if (!isLocked && this.saved !== undefined) {
      this.speed = this.saved;
      this.saved = undefined;
    }
  }

  private reduceForce(delta: number): void {
    const deltaSeconds = delta / 1000;

    this.force *= Math.pow(Speed.FORCE_DECAY, deltaSeconds);

    if (Math.abs(this.force) < Speed.MIN_FORCE_THRESHOLD) {
      this.force = 0;
    }
  }
}
