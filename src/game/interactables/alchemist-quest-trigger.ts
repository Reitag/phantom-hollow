import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { QUEST_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';

export class AlchemistQuestTrigger extends Interactable {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['alchemist-quest']);
  }

  protected onEnter(): void {
    this.ui.showHorizontalTooltip(
      {
        x: INTERACT_TOOLTIP.X,
        y: INTERACT_TOOLTIP.Y,
        width: INTERACT_TOOLTIP.WIDTH,
        fillColor: INTERACT_TOOLTIP.FILL_COLOR,
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
