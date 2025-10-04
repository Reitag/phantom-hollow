export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  maxStack: number;
  use: () => void;
}

export interface InventorySlot {
  item: InventoryItem;
  quantity: number;
}
