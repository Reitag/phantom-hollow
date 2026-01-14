import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { QUEST_TOOLTIP } from '@/constants/tooltip-params';

export class AlchemistQuestTrigger extends Interactable {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['alchemist-quest']);
  }

  protected onEnter(): void {
    this.ui.showHorizontalTooltip(
      {
        x: this.scene.scale.width / 2 - 60,
        y: this.player.y - 40,
        width: 170,
        fillColor: 0x000000,
      },
      QUEST_TOOLTIP
    );
  }

  protected onInteract(): void {
    console.log('[AlchemistQuest] Player interacted (E pressed)');
  }

  protected onLeave(): void {
    this.ui.hideTooltip();
  }
}
