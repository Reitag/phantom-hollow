import { Character } from '@/base/objects/character';
import { SCENE_SIZE } from '@/constants/scene-size';
import { baseStyle } from '@/constants/tooltip-params';
import { WARNING_TEXT } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';
import { TooltipFrameConfig, TooltipContentConfig } from '@/utils/types';

enum TooltipLayout {
  Vertical,
  Horizontal,
}

export class Text {
  private textContainer: Phaser.GameObjects.Text[] = [];
  private damageDisplayContainer: Phaser.GameObjects.Text[] = [];

  // Tooltips
  private container: Phaser.GameObjects.Container | null = null;
  private bg: Phaser.GameObjects.Graphics | null = null;
  private propTexts: Phaser.GameObjects.Text[] = [];

  constructor(private scene: Phaser.Scene) {}

  // Warning text
  public addWarningTextOnScreen(text: string) {
    const index = this.textContainer.length;
    const posY = WARNING_TEXT.START_Y + index * WARNING_TEXT.PADDING;

    const sceneText = this.scene.add
      .text(SCENE_SIZE.WIDTH / 2, posY, text, {
        font: '22px Arial',
        color: '#d60409',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);
    this.textContainer.push(sceneText);

    this.scene.time.delayedCall(2000, () => {
      this.removeWarningFirstText(sceneText);
    });
  }

  private removeWarningFirstText(text: Phaser.GameObjects.Text) {
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration: 500,
      ease: 'Sine.easeIn',
      onComplete: () => {
        const index = this.textContainer.indexOf(text);
        if (index !== -1) this.textContainer.splice(index, 1);
        text.destroy();
        this.repositionWarningTexts();
      },
    });
  }

  private repositionWarningTexts(): void {
    this.textContainer.forEach((t, i) => {
      const targetY = WARNING_TEXT.START_Y + i * WARNING_TEXT.PADDING;
      this.scene.tweens.add({
        targets: t,
        y: targetY,
        duration: 50,
        ease: 'Sine.easeInOut',
      });
    });
  }

  // Damage display
  public addDamageDisplayOnScreen(amount: number | string, target: Character): void {
    const scene = target.scene;
    const { x, y } = target.getWorldTransformMatrix().transformPoint(0, 0);
    const posX = x;
    const posY = y - 20;

    target.setDataEnabled();

    const stack = target.getData('damageTextStack') ?? 0;
    target.setData('damageTextStack', stack + 1);

    const offsetY = stack * 14;

    if (typeof amount === 'number') {
      amount = Phaser.Math.RoundTo(amount, 0);

      if (amount === 0) return;
    }

    const damageText = scene.add
      .text(posX, posY - offsetY, `${amount}`, {
        font: '12px Arial',
        color: '#ffffffff',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(Z_POSITION.UI);

    scene.tweens.add({
      targets: damageText,
      y: posY - 30 - offsetY,
      alpha: 0,
      duration: 2700,
      ease: 'Sine.easeOut',
      onComplete: () => {
        damageText.destroy();

        const current = target.getData('damageTextStack') ?? 1;
        target.setData('damageTextStack', Math.max(0, current - 1));
      },
    });
  }

  // Tooltip text
  public addVerticalTooltip(box: TooltipFrameConfig, content: TooltipContentConfig): void {
    this.destroyTooltip();
    this.buildTooltip(box, content, TooltipLayout.Vertical);
  }

  public addHorizontalTooltip(box: TooltipFrameConfig, content: TooltipContentConfig): void {
    this.destroyTooltip();
    this.buildTooltip(box, content, TooltipLayout.Horizontal);
  }

  public removeTooltip(): void {
    this.destroyTooltip();
  }

  private buildTooltip(
    box: TooltipFrameConfig,
    content: TooltipContentConfig,
    layout: TooltipLayout
  ): void {
    const { x, y, width, fillColor, fillAlpha = 0.9 } = box;
    const padding = 8;

    const style = {
      ...baseStyle,
      wordWrap: layout === TooltipLayout.Vertical ? { width: width - padding * 2 } : undefined,
    };

    this.createTooltipContainer(x, y);

    let offsetX = padding;
    let offsetY = padding;

    const props = [content.title, content.prop_1, content.prop_2, content.prop_3, content.prop_4];

    props.forEach((prop) => {
      if (!prop || !this.container) return;

      const text = this.scene.add.text(offsetX, offsetY, prop.text, {
        ...style,
        ...prop.param,
      });

      this.container.add(text);
      this.propTexts.push(text);

      if (layout === TooltipLayout.Vertical) {
        offsetY += text.height + 4;
      } else {
        offsetX += text.width + 6;
      }
    });

    // Padding bottom / right
    offsetX += padding;
    offsetY += padding;

    const bgWidth = layout === TooltipLayout.Vertical ? width : offsetX;
    const bgHeight = layout === TooltipLayout.Vertical ? offsetY : offsetY + padding * 2;

    this.bg!.fillStyle(fillColor ?? 0x000000, fillAlpha);
    this.bg!.fillRoundedRect(0, 0, bgWidth, bgHeight, 3);

    // Anchor above interaction point
    this.container!.y -= bgHeight;
  }

  private createTooltipContainer(x: number, y: number) {
    this.container = this.scene.add.container(x, y);
    this.bg = this.scene.add.graphics();
    this.container.add(this.bg);
  }

  private destroyTooltip(): void {
    this.container?.destroy();
    this.container = null;

    this.bg?.destroy();
    this.bg = null;

    this.propTexts.forEach((t) => t.destroy());
    this.propTexts.length = 0;
  }
}
