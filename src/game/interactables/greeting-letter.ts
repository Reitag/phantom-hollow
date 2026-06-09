import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Sprite } from '@/base/objects/sprite';
import { BOARD_EVENT_NAMES, Letter } from '@/components/ui/boards/advanced-board';
import { MISC } from '@/constants/asset-keys';
import { GREETING_LETTER_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class GreetingLetter extends Interactable {
  private letter: Sprite;
  private letterBoard: Letter;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['letter']);

    const letterZone = this.triggerZones.getChildren();

    this.letter = new Sprite({
      scene: scene,
      position: {
        x: (letterZone[0] as Phaser.GameObjects.Zone).x + 15,
        y: (letterZone[0] as Phaser.GameObjects.Zone).y + 8,
      },
      keyName: MISC.LETTER,
    });

    this.letterBoard = ServiceLocator.resolve(ServiceKeys.ui).getBoard<Letter>('letter');
  }

  protected onEnter(): void {
    if (this.letterBoard.registerEvents()) {
      this.letter.postFX.addGlow(0xffff00, 2, 0, false);
      this.ui.showHorizontalTooltip(
        {
          x: INTERACT_TOOLTIP.X,
          y: INTERACT_TOOLTIP.Y,
          width: INTERACT_TOOLTIP.WIDTH,
          fillColor: INTERACT_TOOLTIP.FILL_COLOR,
        },
        GREETING_LETTER_TOOLTIP
      );
    }
  }

  protected onInteract(): void {
    if (!this.letterBoard.isOpen) {
      this.letterBoard.scene.events.emit(`open-${BOARD_EVENT_NAMES.LETTER}`);
      this.ui.hideTooltip();
    }
  }

  protected onLeave(): void {
    if (this.letterBoard.isOpen) {
      this.letterBoard.scene.events.emit(`close-${BOARD_EVENT_NAMES.LETTER}`);
    }
    this.letterBoard.unregisterEvents();

    this.letter.postFX.clear();
    this.ui.hideTooltip();
  }
}
