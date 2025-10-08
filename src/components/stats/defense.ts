export class Defense {
  private base: number;
  private modifiers: Map<string, number> = new Map();

  constructor(base: number) {
    this.base = base;
  }

  public get multiplier(): number {
    let total = this.base;
    this.modifiers.forEach((m) => (total *= m));

    return total;
  }

  public addModifier(id: string, multiplier: number): void {
    if (!this.modifiers.has(id)) {
      this.modifiers.set(id, multiplier);
    }
  }

  public removeModifier(id: string): void {
    if (this.modifiers.has(id)) {
      this.modifiers.delete(id);
    }
  }
}
