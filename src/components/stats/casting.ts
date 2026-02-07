type ModifierId = string;

export class Casting {
  private baseTime: number = 1;
  private multipliers = new Map<ModifierId, number>();

  public get value(): number {
    let total = this.baseTime;

    for (const m of this.multipliers.values()) {
      total *= m;
    }

    return total;
  }

  public addMultiplier(id: ModifierId, multiplier: number): void {
    this.multipliers.set(id, multiplier);
  }

  public removeMultiplier(id: ModifierId): void {
    this.multipliers.delete(id);
  }

  public clear(): void {
    this.multipliers.clear();
  }
}
