import { Item, ItemConfig } from '@/base/objects/item';

export class Coin extends Item {
  constructor({ scene, position, keyName, frame, animation }: ItemConfig) {
    super({ scene, position, keyName, frame, animation });
  }
}
