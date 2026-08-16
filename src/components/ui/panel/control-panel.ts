import { Panel, PanelConfig } from '@/base/ui/panel';
import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SaveService } from '@/infrastructure/save-service';
import { QUEST_IDS } from '@/constants/quest-ids';
import { QuestLog } from '../boards/quest-log';
import { Tutorial } from '../boards/tutorial';

type ControlListeners = {
  pointerdown: () => void;
  pointerover: () => void;
  pointerout: () => void;
  pointerup: () => void;
};

export class ControlPanel extends Panel {
  private trophyOverlay: Phaser.GameObjects.Rectangle | null = null;
  private trophyTween: Phaser.Tweens.Tween | null = null;

  // Listeners
  private controlListenersMap = new Map<number, ControlListeners>();

  constructor({ scene, slotOffSet, cell }: PanelConfig) {
    super({
      scene: scene,
      slotOffSet: slotOffSet,
      cell: cell,
    });

    const controlTextureKeys = [UI.GEAR_CONTROL, UI.CLOUD_CONTROL, UI.TROPHY_CONTROL];

    for (let i = 0; i < this.slots.length; i++) {
      if (!controlTextureKeys[i]) break;

      const pos = this.getCellPosition(i);

      const iconImage = scene.add
        .image(pos.x + 6, pos.y + 6, controlTextureKeys[i])
        .setOrigin(0, 0)
        .setDepth(this.ICON_DEPTH);

      this.slots[i].icon = iconImage;

      this.clickBinder.bind(iconImage);

      this.setupControlBehavior(i, iconImage);

      // For trophy blink
      if (i === 2) {
        //this.startTrophyOverlayBlink(iconImage);
      }
    }
  }

  public removeAllControllPanelListeners(): void {
    for (let i = 0; i < this.slots.length; i++) {
      const icon = this.slots[i].icon;

      if (icon !== undefined) {
        this.removeControlBehavior(i, icon);
      }
    }
  }

  protected emitSlotRelease(i: number): void {}
  protected triggerTooltip(index: number): void {}

  // Turned it off due to info button in ui-scene
  private startTrophyOverlayBlink(icon: Phaser.GameObjects.Image): void {
    const mainQuestState = SaveService.getQuestState(QUEST_IDS.MAIN_QUEST);
    if (mainQuestState === 'waiting' || mainQuestState === 'completed' || mainQuestState === 'done')
      return;

    this.trophyOverlay = this.scene.add
      .rectangle(icon.x, icon.y, icon.displayWidth, icon.displayHeight, 0xffffff)
      .setOrigin(0, 0)
      .setDepth(this.ICON_DEPTH + 1)
      .setAlpha(0);

    this.trophyOverlay.setBlendMode(Phaser.BlendModes.ADD);

    this.trophyTween = this.scene.tweens.add({
      targets: this.trophyOverlay,
      alpha: 0.7,
      duration: 600,
      yoyo: true,
      loop: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // Turned it off due to info button in ui-scene
  private stopTrophyOverlayBlink(): void {
    if (this.trophyTween) {
      this.trophyTween.stop();
      this.trophyTween = null;
    }

    if (this.trophyOverlay) {
      this.trophyOverlay.destroy();
      this.trophyOverlay = null;

      // Set waitinf state for main quest
      SaveService.setQuestState(QUEST_IDS.MAIN_QUEST, 'waiting');
    }
  }

  private setupControlBehavior(index: number, icon: Phaser.GameObjects.Image): void {
    icon.setInteractive();

    const listeners: ControlListeners = {
      pointerdown: () => this.clickContext.onPress(index),
      pointerover: () => this.clickContext.onHover?.(index),
      pointerout: () => this.clickContext.onHoverOut?.(),
      pointerup: () => {
        this.clickContext.onRelease(index);
        switch (index) {
          case 0:
            this.handlePauseBtn();
            break;
          case 1:
            this.handleHelpBtn();
            break;
          case 2:
            // Just turned it ooff due to Icon info in ui-scene
            //this.stopTrophyOverlayBlink();
            this.handleQuestsBtn();
            break;
        }
      },
    };

    icon.on('pointerdown', listeners.pointerdown);
    icon.on('pointerover', listeners.pointerover);
    icon.on('pointerout', listeners.pointerout);
    icon.on('pointerup', listeners.pointerup);

    this.controlListenersMap.set(index, listeners);
  }

  private removeControlBehavior(index: number, icon: Phaser.GameObjects.Image): void {
    const listeners = this.controlListenersMap.get(index);

    if (listeners) {
      icon.off('pointerdown', listeners.pointerdown);
      icon.off('pointerover', listeners.pointerover);
      icon.off('pointerout', listeners.pointerout);
      icon.off('pointerup', listeners.pointerup);

      this.controlListenersMap.delete(index);
    }
  }

  private handlePauseBtn(): void {
    this.scene.scene.launch('PauseScene').bringToTop('PauseScene');
  }

  private handleHelpBtn(): void {
    ServiceLocator.resolve(ServiceKeys.ui).getBoard<Tutorial>('tutorial').toggleTutorial();
  }

  private handleQuestsBtn(): void {
    ServiceLocator.resolve(ServiceKeys.ui).getBoard<QuestLog>('quest-log').toggleQuestLog();
  }
}
