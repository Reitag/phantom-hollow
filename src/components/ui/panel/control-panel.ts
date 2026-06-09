import { Panel, PanelConfig } from '@/base/ui/panel';
import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SaveService } from '@/infrastructure/save-service';
import { QUEST_IDS } from '@/constants/quest-ids';
import { QuestLog } from '../boards/quest-log';

export class ControlPanel extends Panel {
  private trophyOverlay: Phaser.GameObjects.Rectangle | null = null;
  private trophyTween: Phaser.Tweens.Tween | null = null;

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
        this.startTrophyOverlayBlink(iconImage);
      }
    }
  }

  protected emitSlotRelease(i: number): void {}
  protected triggerTooltip(index: number): void {}

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
    icon.setInteractive({ useHandCursor: true });

    icon.on('pointerdown', () => this.clickContext.onPress(index));
    icon.on('pointerover', () => this.clickContext.onHover?.(index));
    icon.on('pointerout', () => this.clickContext.onHoverOut?.());

    icon.on('pointerup', () => {
      this.clickContext.onRelease(index);

      switch (index) {
        case 0:
          this.handlePauseBtn();
          break;
        case 1:
          this.handleHelpBtn();
          break;
        case 2:
          this.stopTrophyOverlayBlink();
          this.handleQuestsBtn();
          break;
      }
    });
  }

  private handlePauseBtn(): void {
    this.scene.input.setDefaultCursor('default');
    this.scene.scene.launch('PauseScene').bringToTop('PauseScene');
  }

  private handleHelpBtn(): void {
    console.log('Cloud has been opened');
  }

  private handleQuestsBtn(): void {
    ServiceLocator.resolve(ServiceKeys.ui).getBoard<QuestLog>('quest-log').toggleQuestLog();
  }
}
