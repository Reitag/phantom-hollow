import { InputController } from '@/base/input/input-controller';
import { InventoryIconContainer } from '@/components/ui/inventory-icons/inventory-icon-container';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { InventoryItem, InventorySlot } from '@/utils/types';

export class InventorySystem {
  private slots: (InventorySlot | null)[];
  private iconContainer: InventoryIconContainer;

  constructor() {
    this.iconContainer = ServiceLocator.resolve(ServiceKeys.ui).getIconContainer();
    this.slots = Array(this.iconContainer.cellQuantity).fill(null);
  }

  public getSlot(index: number): InventorySlot | null {
    return this.slots[index] ?? null;
  }

  public handleInput(input: InputController | null): void {
    if (!input) return;

    if (input.isFirstItemDown) {
      this.useSlot(0); // Slot 0 (A)
    }
    if (input.isSecondItemDown) {
      this.useSlot(1); // Slot 1 (S)
    }
    if (input.isThirdItemDown) {
      this.useSlot(2); // Slot 2 (D)
    }
    if (input.isFourthItemDown) {
      this.useSlot(3); // Slot 3 (F)
    }
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
      const emptySlots = this.slots.filter((slot) => slot === null).length;
      const capacityFromEmpty = emptySlots * item.maxStack;
      return remaining <= capacityFromEmpty;
    }

    return true;
  }

  public addItem(item: InventoryItem, quantity = 1): void {
    for (const slot of this.slots) {
      if (!slot || slot.item.id !== item.id) continue;

      const free = item.maxStack - slot.quantity;
      if (free <= 0) continue;

      const add = Math.min(free, quantity);
      slot.quantity += add;
      quantity -= add;
      if (quantity <= 0) {
        this.updateUI();
        return;
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

  public useSlot(index: number, quantity: number = 1): void {
    const slot = this.slots[index];
    if (!slot) return;

    if (!slot.item.use()) return;

    slot.quantity -= quantity;
    if (slot.quantity <= 0) {
      this.slots[index] = null;
    }
    this.updateUI();
  }

  public swapSlots(from: number, to: number): void {
    const temp = this.slots[from];
    this.slots[from] = this.slots[to];
    this.slots[to] = temp;

    this.updateUI();
  }

  public destroySlot(index: number): void {
    this.slots[index] = null;
    this.updateUI();
  }

  public getSlots(): (InventorySlot | null)[] {
    return [...this.slots];
  }

  public getItemIndex(id: string): number | undefined {
    let index = 0;
    for (const slot of this.slots) {
      if (!slot) {
        ++index;
        continue;
      }
      if (slot.item.id !== id) {
        ++index;
        continue;
      }
      if (slot.item.id === id) return index;
    }
    return undefined;
  }

  public updateUI(): void {
    this.slots.forEach((slot, index) => {
      if (slot) {
        this.iconContainer.setIcon(index, slot.item.iconKey, slot.quantity);
      } else {
        this.iconContainer.removeIcon(index);
      }
    });
  }
}
