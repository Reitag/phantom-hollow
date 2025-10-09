export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  maxStack: number;
  use: () => boolean;
}

export interface InventorySlot {
  item: InventoryItem;
  quantity: number;
}
