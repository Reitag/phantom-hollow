import { Interactable, InteractableNames } from '@/base/objects/interactable';

export class AlchemistQuestTrigger extends Interactable {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['alchemist-quest']);
  }

  protected onEnter(): void {
    console.log('[AlchemistQuest] Player entered trigger zone');
  }

  protected onInteract(): void {
    console.log('[AlchemistQuest] Player interacted (E pressed)');
  }

  protected onLeave(): void {
    console.log('[AlchemistQuest] Player left trigger zone');
  }
}
