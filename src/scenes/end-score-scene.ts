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

    this.container = this.add.container(width / 2, height * 0.2);

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Volkhov',
      fontSize: '42px',
      color: '#ffd700',
      stroke: '#403700',
      strokeThickness: 2,
      fontStyle: 'bold',
    };

    const labelStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Volkhov',
      fontSize: '28px',
      color: '#efe5c4',
    };

    const valueStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Volkhov',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    };

    const title = this.add.text(0, 0, 'TOTAL SCORE', titleStyle).setOrigin(0.5);
    this.container.add(title);

    const rowsData = [
      { label: 'Damage done:', target: stats.dmgDone },
      { label: 'Damage received:', target: stats.dmgRecieved },
      { label: 'Enemies defeated:', target: stats.enemiesDefeated },
      { label: 'Gold earned:', target: stats.goldEarned },
    ];

    const chainConfigs: Phaser.Types.Tweens.TweenBuilderConfig[] = [];

    const tableLeft = -250;
    const tableRight = 250;

    rowsData.forEach((row, index) => {
      const rowY = 120 + index * 75;
      const labelText = this.add.text(tableLeft, rowY, row.label, labelStyle).setOrigin(0, 0.5);
      const valueText = this.add.text(tableRight, rowY, '', valueStyle).setOrigin(1, 0.5);

      this.container?.add([labelText, valueText]);
      this.addScoreCounterToChain(chainConfigs, valueText, row.target);
    });

    this.continueBtn = this.createButton(width / 2, height * 0.9, {
      key: UI.MISC_UI_OK_BTN,
      action: () => this.handleContinue(),
    });
    this.continueBtn.setAlpha(0).disableInteractive();

    if (chainConfigs.length > 0) {
      this.tweens.chain({
        tweens: chainConfigs,
        onComplete: () => {
          this.continueBtn?.setAlpha(1).setInteractive();
        },
      });
    } else {
      this.continueBtn?.setAlpha(1).setInteractive();
    }
  }

  private addScoreCounterToChain(
    configs: Phaser.Types.Tweens.TweenBuilderConfig[],
    textObject: Phaser.GameObjects.Text,
    targetValue: number
  ): void {
    if (targetValue === 0) {
      configs.push({
        targets: {},
        duration: 1000,
        onComplete: () => {
          textObject.setText('0');
        },
      });
      return;
    }

    const counter = { value: 1 };
    const dynamicDuration = Phaser.Math.Clamp(targetValue * 45, 400, 3000);

    configs.push({
      targets: counter,
      value: targetValue,
      duration: dynamicDuration,
      ease: 'Linear',
      onUpdate: () => {
        textObject.setText(Math.floor(counter.value).toString());
      },
      onComplete: () => {
        textObject.setText(targetValue.toString());
      },
    });

    configs.push({
      targets: {},
      duration: 1000,
    });
  }

  private handleContinue(): void {
    // If level is finished
    ServiceLocator.resolve(ServiceKeys.scoreTracker).reset();
    SaveService.clear();
    ServiceLocator.clear();

    this.scene.stop();
    this.scene.start('MainMenuScene');
  }

  protected cleanup(): void {
    super.cleanup();

    this.backGround?.destroy();
    this.backGround = null;

    this.container?.destroy();
    this.container = null;

    this.continueBtn?.destroy();
    this.continueBtn = null;
  }
}
