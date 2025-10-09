export class Health {
  private base: number;
  private total: number;

  constructor(base: number) {
    this.base = base;
    this.total = base;
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
