import { ServiceLocator, ServiceKeys } from '@/infrastructure/service-locator';
import { InputController } from '@/base/input/input-controller';
import { InventorySlot, InventoryItem } from '@/utils/types';
import { UiSystem } from './ui-system';

export class InventorySystem {
  private readonly max = 4;

  private slots: (InventorySlot | null)[] = [];
  private ui: UiSystem;

  constructor() {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);

    this.slots = Array(this.max).fill(null);
  }

  public canAdd(item: InventoryItem, quantity: number = 1): boolean {
    let remaining = quantity;

    for (const slot of this.slots) {
      if (!slot) continue;
      if (slot.item.id !== item.id) continue;

      const freeInStack = slot.item.maxStack - slot.quantity;
      if (freeInStack > 0) {
        remaining -= Math.min(freeInStack, remaining);
        if (remaining <= 0) return true;
      }
    }

    if (remaining > 0) {
      const emptySlots = this.slots.filter((s) => s === null).length;
      const capacityFromEmpty = emptySlots * item.maxStack;
      return remaining <= capacityFromEmpty;
    }

    return true;
  }

  public setItems(items: (InventorySlot | null)[]): void {
    this.slots = items;
    this.updateUI();
  }

  public getItems(): (InventorySlot | null)[] {
    return [...this.slots];
  }

  public addItem(item: InventoryItem, quantity: number = 1): void {
    for (const slot of this.slots) {
      if (slot && slot.item.id === item.id) {
        const availableSpace = item.maxStack - slot.quantity;

        if (availableSpace > 0) {
          const toAdd = Math.min(availableSpace, quantity);
          slot.quantity += toAdd;
          quantity -= toAdd;

          if (quantity <= 0) {
            this.updateUI();
            return;
          }
        }
      }
    }

    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i]) {
        const toAdd = Math.min(item.maxStack, quantity);
        this.slots[i] = { item, quantity: toAdd };
        quantity -= toAdd;

        if (quantity <= 0) {
          this.updateUI();
          return;
        }
      }
    }
  }

  public removeItem(index: number, quantity: number = 1): void {
    const slot = this.slots[index];
    if (!slot) return;

    slot.quantity -= quantity;
    if (slot.quantity <= 0) {
      this.slots[index] = null;
    }
    this.updateUI();
  }

  public useItem(index: number): void {
    const slot = this.slots[index];
    this.ui.highlightSpot(index);
    if (!slot) return;

    if (!slot.item.use()) return;
    slot.quantity -= 1;

    if (slot.quantity <= 0) {
      this.slots[index] = null;
    }
    this.updateUI();
  }

  public handleInput(input: InputController | null): void {
    if (!input) return;

    if (input.isFirstItemDown) {
      this.useItem(0); // Slot 0 (A)
    }
    if (input.isSecondItemDown) {
      this.useItem(1); // Slot 1 (S)
    }
    if (input.isThirdItemDown) {
      this.useItem(2); // Slot 2 (D)
    }
    if (input.isFourthItemDown) {
      this.useItem(3); // Slot 3 (F)
    }
  }

  private updateUI(): void {
    this.ui.updateInventory(this.getItems());
  }
}
