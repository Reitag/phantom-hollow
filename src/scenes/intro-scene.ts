import { BaseScene } from '@/base/scene/base-scene';
import { UI } from '@/constants/asset-keys';
import { INTRO_TEXT } from '@/constants/board-texts';

export class IntroScene extends BaseScene {
  private storyText: Phaser.GameObjects.Text | null = null;
  private continueButton: Phaser.GameObjects.Image | null = null;
  private typewriterTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super('IntroScene');
  }

  public create(): void {
    super.create();

    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    // 5% under the high side of screen
    const textStartY = height * 0.05;
    const textStartX = 100;

    this.storyText = this.add
      .text(textStartX, textStartY, '', {
        fontSize: '22px',
        fontFamily: 'Volkhov',
        color: '#ffffff',
        align: 'left',
        lineSpacing: 10,
        wordWrap: { width: width - textStartX * 2 },
      })
      .setOrigin(0, 0)
      .setShadow(2, 2, '#000000', 4);

    this.startTypewriter(INTRO_TEXT.TEXT, 90);

    // Continue Button
    this.continueButton = this.createButton(width / 2, height - 40, {
      key: UI.MENU_UI_CONTINUE_BTN,
      action: () => this.startGame(),
    });

    this.buttons.push(this.continueButton);

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private startTypewriter(fullText: string, delay: number): void {
    if (!this.storyText) return;

    const maxWidth = this.storyText.style.wordWrapWidth || 600;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    let formattedText = fullText;

    if (context) {
      context.font = '22px Volkhov';

      const paragraphs = fullText.split('\n');
      const formattedParagraphs: string[] = [];

      paragraphs.forEach((paragraph) => {
        const words = paragraph.split(' ');
        let currentLine = '';
        let formattedParagraph = '';

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = context.measureText(testLine);

          if (metrics.width > maxWidth) {
            formattedParagraph += (formattedParagraph ? '\n' : '') + currentLine;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        formattedParagraph += (formattedParagraph ? '\n' : '') + currentLine;
        formattedParagraphs.push(formattedParagraph);
      });

      formattedText = formattedParagraphs.join('\n');
    }

    let currentCharacter = 0;

    this.typewriterTimer = this.time.addEvent({
      delay: delay,
      repeat: formattedText.length - 1,
      callback: () => {
        if (this.storyText) {
          this.storyText.text += formattedText[currentCharacter];
          currentCharacter++;
        }
      },
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);

    this.time.delayedCall(800, () => {
      this.scene.start('LevelOneScene', {});
    });
  }

  protected cleanup(): void {
    super.cleanup();

    this.continueButton?.destroy();
    this.continueButton = null;

    this.storyText?.destroy();
    this.storyText = null;

    this.typewriterTimer?.destroy();
    this.typewriterTimer = null;
  }
}
