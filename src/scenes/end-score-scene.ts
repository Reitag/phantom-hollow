import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceLocator, ServiceKeys } from '@/infrastructure/service-locator';

export class EndScoreScene extends BaseScene {
  private container: Phaser.GameObjects.Container | null = null;
  private backGround: Phaser.GameObjects.Shape | null = null;
  private continueBtn: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('EndScoreScene');
  }

  public create(): void {
    super.create();

    const { width, height } = this.scale;

    const stats = ServiceLocator.resolve(ServiceKeys.scoreTracker);

    if (this.scene.isActive('LevelOneScene')) this.scene.stop('LevelOneScene');
    if (this.scene.isActive('UiScene')) this.scene.stop('UiScene');

    this.backGround = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive();

    this.container = this.add.container(width / 2, height * 0.3);

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
    };

    const labelStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#aaaaaa',
    };

    const valueStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    };

    const title = this.add.text(0, 0, 'РЕЗУЛЬТАТЫ ИГРЫ', titleStyle).setOrigin(0.5);

    const line = this.add.graphics();
    line.lineStyle(3, 0xffffff, 0.5);
    line.lineBetween(-200, 40, 200, 40);

    const dmgDoneLabel = this.add.text(-150, 90, 'Damage done:', labelStyle).setOrigin(0, 0.5);
    const dmgDoneValue = this.add.text(150, 90, '0', valueStyle).setOrigin(1, 0.5);

    const dmgRecievedLabel = this.add
      .text(-150, 140, 'Damage recieved:', labelStyle)
      .setOrigin(0, 0.5);
    const dmgRecievedValue = this.add.text(150, 140, '0', valueStyle).setOrigin(1, 0.5);

    const enemiesLabel = this.add
      .text(-150, 190, 'Enemies defeated:', labelStyle)
      .setOrigin(0, 0.5);
    const enemiesValue = this.add.text(150, 190, '0', valueStyle).setOrigin(1, 0.5);

    const goldEarnedLabel = this.add.text(-150, 240, 'Gold earned:', labelStyle).setOrigin(0, 0.5);
    const goldEarnedValue = this.add.text(150, 240, '0', valueStyle).setOrigin(1, 0.5);

    this.container.add([
      title,
      line,
      dmgDoneLabel,
      dmgDoneValue,
      dmgRecievedLabel,
      dmgRecievedValue,
      enemiesLabel,
      enemiesValue,
      goldEarnedLabel,
      goldEarnedValue,
    ]);

    this.animateScoreCounter(dmgDoneValue, stats.dmgDone, 0);
    this.animateScoreCounter(dmgRecievedValue, stats.dmgRecieved, 200);
    this.animateScoreCounter(enemiesValue, stats.enemiesDefeated, 400);
    this.animateScoreCounter(goldEarnedValue, stats.goldEarned, 600);

    this.continueBtn = this.createButton(width / 2, height * 0.8, {
      key: UI.MISC_UI_OK_BTN,
      action: () => this.handleContinue(),
    });
  }

  private animateScoreCounter(
    textObject: Phaser.GameObjects.Text,
    targetValue: number,
    delay: number
  ): void {
    if (targetValue === 0) return;

    const counter = { value: 0 };
    this.tweens.add({
      targets: counter,
      value: targetValue,
      duration: 1000,
      delay: delay,
      ease: 'Power1.easeOut',
      onUpdate: () => {
        textObject.setText(Math.floor(counter.value).toString());
      },
      onComplete: () => {
        textObject.setText(targetValue.toString());
      },
    });
  }

  private handleContinue(): void {
    // If level is finished
    ServiceLocator.resolve(ServiceKeys.scoreTracker).reset();
    ServiceLocator.clear();

    this.scene.stop();
    this.scene.start('MainMenuScene');
  }

  protected cleanup(): void {
    super.cleanup();

    if (this.backGround) {
      this.backGround.destroy();
      this.backGround = null;
    }
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    if (this.continueBtn) {
      this.continueBtn.destroy();
      this.continueBtn = null;
    }
  }
}
