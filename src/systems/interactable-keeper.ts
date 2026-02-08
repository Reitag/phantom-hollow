import { Interactable } from '@/base/objects/interactable';

export class InteractableKeeper {
  private list: Interactable[] = [];

  public add(obj: Interactable): void {
    this.list.push(obj);
  }

  public update(): void {
    for (const obj of this.list) {
      obj.update();
    }
  }

  public get<T extends Interactable>(ctor: new (arg: Phaser.Scene) => T): T | undefined {
    return this.list.find((obj) => obj instanceof ctor) as T | undefined;
  }

  public clear(): void {
    this.list.length = 0;
  }
}
