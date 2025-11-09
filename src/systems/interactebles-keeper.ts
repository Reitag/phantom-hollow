import { Interactable } from '@/base/objects/interactable';

export class InteractablesKeeper {
  private list: Interactable[] = [];

  public add(obj: Interactable): void {
    this.list.push(obj);
  }

  public update(): void {
    for (const obj of this.list) {
      obj.update();
    }
  }

  public clear(): void {
    this.list.length = 0;
  }
}
