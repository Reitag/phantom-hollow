export class KeyBindingsService {
  private slotLabels: string[] = [];

  constructor(slotCount: number) {
    this.slotLabels = new Array(slotCount).fill('');
  }

  public setSlotLabel(slot: number, label: string): void {
    this.slotLabels[slot] = label;
  }

  public getSlotLabel(slot: number): string {
    return this.slotLabels[slot] ?? '';
  }

  public getSlotCount(): number {
    return this.slotLabels.length;
  }
}
