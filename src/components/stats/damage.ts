export abstract class Damage {
  protected base: number;
  protected multipliers: Map<string, number> = new Map();

  constructor(base: number) {
    this.base = base;
  }

  protected get total(): number {
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

export class MeleeAttack extends Damage {
  constructor(baseDamage: number) {
    super(baseDamage);
  }

  public get damage(): number {
    return this.total;
  }
}

export class SpellPower extends Damage {
  private instantCast = false;

  constructor(basePower: number) {
    super(basePower);
  }

  public get multiplier(): number {
    return this.total;
  }

  public get isInstantCast(): boolean {
    return this.instantCast;
  }

  public set allowInstantCast(value: boolean) {
    this.instantCast = value;
  }
}
