export class Health {
  private base: number;
  private total: number;

  constructor(base: number) {
    this.base = base;
    this.total = base;
  }

  public set current(value: number) {
    const percent = this.base / this.total;

    this.total = value;

    this.base = Math.round(this.total * percent);

    if (this.base <= 0 && percent > 0) {
      this.base = 1;
    }
  }

  public get current(): number {
    return this.base;
  }

  public get max(): number {
    return this.total;
  }

  public get zero(): boolean {
    return this.current <= 0;
  }

  public heal(amount: number): void {
    this.base = Math.min(this.current + amount, this.max);
  }

  public applyDamage(amount: number): void {
    this.base -= amount;
  }
}
