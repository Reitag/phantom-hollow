export class MeleeAttack {
  private base: number;
  private multipliers: Map<string, number> = new Map();

  constructor(base: number) {
    this.base = base;
  }

  public get damage(): number {
    let total = this.base;
    this.multipliers.forEach((m) => (total *= m));

    return total;
  }

  public addMultiplier(id: string, multiplier: number): void {
    this.multipliers.set(id, multiplier);
  }

  public removeMultiplier(id: string): void {
    this.multipliers.delete(id);
  }

  public clearMultipliers(): void {
    this.multipliers.clear();
  }
}
