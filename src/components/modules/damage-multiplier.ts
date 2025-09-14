export class DamageMultiplier {
  private multipliers: Map<string, number> = new Map();

  public addMultiplier(id: string, multiplier: number): void {
    this.multipliers.set(id, multiplier);
  }

  public removeMultiplier(id: string): void {
    this.multipliers.delete(id);
  }

  public clearMultipliers(): void {
    this.multipliers.clear();
  }

  public calculateTotal(baseDamage: number): number {
    let totalMultiplier = 1;
    this.multipliers.forEach((value) => {
      totalMultiplier *= value;
    });
    return baseDamage * totalMultiplier;
  }
}
