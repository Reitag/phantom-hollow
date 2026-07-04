import { Board, Handlers } from '@/base/ui/board';
import { UI } from '@/constants/asset-keys';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { SCENE_SIZE } from '@/constants/scene-size';
import { TUTORIAL_UI } from '@/constants/ui-coordinates';
import { Position } from '@/utils/types';

export class Tutorial extends Board {
  private closeButton: Phaser.GameObjects.Image;
  private prevButton: Phaser.GameObjects.Image;
  private nextButton: Phaser.GameObjects.Image;

  private chapterImages: Phaser.GameObjects.Image[];
  private currentChapterIndex: number = 0;
  private totalChapters: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    // Board and BG
    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 2, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    const bg = this.scene.add.image(0, 0, UI.TUTORIAL_BOARD);
    this.board.add(bg);

    // Buttons
    const closeBtnPos = this.alignCoords(bg, TUTORIAL_UI.CLOSE_BTN.X, TUTORIAL_UI.CLOSE_BTN.Y);
    this.closeButton = this.scene.add
      .image(closeBtnPos.x, closeBtnPos.y, UI.LETTER_UI_CLOSE_BTN) // Used Letter Close button in case that this does not exist anything esle
      .setInteractive();

    const prevBtnPos = this.alignCoords(bg, TUTORIAL_UI.PREV_BTN.X, TUTORIAL_UI.PREV_BTN.Y);
    this.prevButton = this.scene.add
      .image(prevBtnPos.x, prevBtnPos.y, UI.MISC_PREV_BTN)
      .setInteractive();

    const nextBtnPos = this.alignCoords(bg, TUTORIAL_UI.NEXT_BTN.X, TUTORIAL_UI.NEXT_BTN.Y);
    this.nextButton = this.scene.add
      .image(nextBtnPos.x, nextBtnPos.y, UI.MISC_NEXT_BTN)
      .setInteractive();

    this.board.add(this.prevButton);
    this.board.add(this.closeButton);
    this.board.add(this.nextButton);

    // Chapters
    this.chapterImages = [
      this.scene.add.image(0, -20, UI.TUT_CONTROLS).setVisible(false),
      this.scene.add.image(0, -20, UI.TUT_UI).setVisible(false),
      this.scene.add.image(0, -20, UI.TUT_WORLD_ELEMENTS).setVisible(false),
    ];
    this.totalChapters = this.chapterImages.length;

    this.chapterImages.forEach((img) => this.board?.add(img));
    this.chapterImages[this.currentChapterIndex].setVisible(true);

    // Buttons state
    this.updateButtonStates();
  }

  public toggleTutorial(): void {
    if (!this.isOpen) {
      this.openBoard();
      this.registerTutorialEvents();
    } else {
      this.closeBoard();
      this.unregisterTutorialEvents([this.prevButton, this.closeButton, this.nextButton]);
    }
  }

  private changeChapter(step: number): void {
    const nextIndex = this.currentChapterIndex + step;

    if (nextIndex >= 0 && nextIndex < this.totalChapters) {
      this.chapterImages[this.currentChapterIndex].setVisible(false);
      this.currentChapterIndex = nextIndex;
      this.chapterImages[this.currentChapterIndex].setVisible(true);

      // Update states
      this.updateButtonStates();
    }
  }

  private updateButtonStates(): void {
    if (this.currentChapterIndex === 0) {
      this.prevButton.disableInteractive();
      this.prevButton.setTexture(UI.MISC_PREV_DIS_BTN);
    } else {
      this.prevButton.setInteractive();
      this.prevButton.setTexture(UI.MISC_PREV_BTN);
    }

    if (this.currentChapterIndex === this.totalChapters - 1) {
      this.nextButton.disableInteractive();
      this.nextButton.setTexture(UI.MISC_NEXT_DIS_BTN);
    } else {
      this.nextButton.setInteractive();
      this.nextButton.setTexture(UI.MISC_NEXT_BTN);
    }
  }

  private registerTutorialEvents(): void {
    [
      {
        button: this.prevButton,
        onUp: () => {
          this.removeHoverEffect();
          this.changeChapter(-1);
        },
      },
      {
        button: this.closeButton,
        onUp: () => {
          this.removeHoverEffect();
          this.toggleTutorial();
        },
      },
      {
        button: this.nextButton,
        onUp: () => {
          this.removeHoverEffect();
          this.changeChapter(1);
        },
      },
    ].forEach((element) => {
      const pos = this.alignCoords(element.button, element.button.x, element.button.y);
      const handlers = this.createButtonHandlers(element.button, pos);

      handlers.onUp = element.onUp;

      this.bundleHandlers.set(element.button, handlers);
      this.attachListeners(element.button, handlers);
    });
  }

  private unregisterTutorialEvents(targets: Phaser.GameObjects.Image[]): void {
    targets.forEach((target) => {
      const handlers = this.bundleHandlers.get(target);
      if (!handlers) return;

      const events: [string, () => void][] = [
        ['pointerover', handlers.onOver],
        ['pointerout', handlers.onOut],
        ['pointerdown', handlers.onDown],
        ['pointerup', handlers.onUp],
      ];

      events.forEach(([event, handler]) => target.off(event, handler));
      this.bundleHandlers.delete(target);
    });
  }

  private attachListeners(target: Phaser.GameObjects.Image, handlers: Handlers): void {
    target
      .on('pointerover', handlers.onOver)
      .on('pointerout', handlers.onOut)
      .on('pointerdown', handlers.onDown)
      .on('pointerup', handlers.onUp);
  }

  private createButtonHandlers(target: Phaser.GameObjects.Image, pos: Position): Handlers {
    const createEffect = (color: number, alpha: number, yOffset = 0) => {
      this.removeHoverEffect();
      this.hoverEffect = this.scene.add
        .graphics()
        .fillStyle(color, alpha)
        .fillRoundedRect(pos.x, pos.y + yOffset, target.width, target.height, 6);
      this.board?.add(this.hoverEffect);
    };

    return {
      onOver: () => createEffect(BUTTON_HOVERS.POINTEROVER.COLOR, BUTTON_HOVERS.POINTEROVER.ALPHA),
      onOut: () => this.removeHoverEffect(),
      onDown: () =>
        createEffect(BUTTON_HOVERS.POINTERDOWN.COLOR, BUTTON_HOVERS.POINTERDOWN.ALPHA, 1),
      onUp: () => {},
    };
  }
}
