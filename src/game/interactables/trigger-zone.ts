import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Triggerkey } from '@/utils/types';

export class TriggerZone extends Interactable {
  private key: string;

  constructor(scene: Phaser.Scene, key: Triggerkey) {
    super(scene);
    this.key = `${key} - trigger-zone`;
    this.createTriggerZones(InteractableNames[`${key}`]);
  }
  public get triggerEventOn(): string {
    return this.key + 'on';
  }
  public get triggerEventOff(): string {
    return this.key + 'off';
  }
  protected onEnter(): void {
    this.scene.events.emit(this.triggerEventOn);
  }
  protected onInteract(): void {}

  protected onLeave(): void {
    this.scene.events.emit(this.triggerEventOff);
  }
}
