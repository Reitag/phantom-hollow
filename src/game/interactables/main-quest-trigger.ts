import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { BOARD_EVENT_NAMES, MainQuest } from '@/components/ui/boards/advanced-board';
import { MISC } from '@/constants/asset-keys';
import { QUEST_IDS } from '@/constants/quest-ids';
import { QUEST_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';
import { QuestMark } from '@/entities/misc/quest-mark';
import { Shining } from '@/entities/misc/shining';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export class MainQuestTrigger extends Interactable {
  private vfx: Shining;
  private quest: MainQuest;
  private questMark: QuestMark;

  constructor(scene: Phaser.Scene, pos: Position) {
    super(scene);
    this.quest = ServiceLocator.resolve(ServiceKeys.ui).getBoard<MainQuest>('main-quest');
    this.addTriggerZone({ x: pos.x - 15, y: pos.y + 32, width: 32, height: 32 });

    this.vfx = new Shining({
      scene: this.scene,
      position: {
        x: pos.x - 15,
        y: pos.y + 32,
      },
      keyName: MISC.SHINING,
      frame: 0,
    }).setDepth(Z_POSITION.VFX);

    this.questMark = new QuestMark({
      scene: scene,
      position: { x: pos.x - 10, y: pos.y - 5 },
      keyName: MISC.QUEST_MARK,
      frame: 0,
    });
    this.questMark.changeMarkToCompleted();
  }

  public update(delta?: number | undefined): void {
    super.update(delta);
    if (SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) === 'done' && this.questMark.active) {
      this.questMark.destroy();
      this.vfx.destroy();
    }
  }

  protected onEnter(): void {
    if (SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) === 'done') return;

    if (this.quest.registerEvents()) {
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
  }

  protected onInteract(): void {
    if (SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) === 'done') return;

    if (!this.quest.isOpen) {
      this.quest.scene.events.emit(`open-${BOARD_EVENT_NAMES.MAIN_QUEST}`);
      this.ui.hideTooltip();
    }
  }

  protected onLeave(): void {
    if (SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) === 'done') return;

    if (this.quest.isOpen) {
      this.quest.scene.events.emit(`close-${BOARD_EVENT_NAMES.MAIN_QUEST}`);
    }
    this.quest.unregisterEvents();
    this.ui.hideTooltip();
  }
}
