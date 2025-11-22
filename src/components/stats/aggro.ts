export class Aggro {
  private value: number;
  private readonly max: number;
  private readonly triggerThreshold: number;
  private readonly decayRate: number;

  constructor(max = 100, triggerThreshold = 50, decayRate = 15) {
    this.value = 0;
    this.max = max;
    this.triggerThreshold = triggerThreshold;
    this.decayRate = decayRate;
  }

  get meter(): number {
    return this.value;
  }

  get isAggroed(): boolean {
    return this.value >= this.triggerThreshold;
  }

  public increase(amount: number): void {
    this.value = Math.min(this.value + amount, this.max);
  }

  public decrease(delta: number): void {
    this.value = Math.max(this.value - this.decayRate * (delta / 1000), 0);
  }

  public reset(): void {
    this.value = 0;
  }
}
