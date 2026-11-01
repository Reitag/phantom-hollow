import { AUDIO } from '@/constants/asset-keys';
import { BUTTON_HOVERS } from '@/constants/button-hovers';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export abstract class Board {
  protected open = false;
  protected board: Phaser.GameObjects.Container | null = null;
  protected container: Phaser.GameObjects.Container | null = null;
  protected hoverEffect: Phaser.GameObjects.Graphics | null = null;

  protected bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  protected readonly mainQuestTitle = 'The Last Stand of Embercrest';

  // Scene only need to be set on 'public' due to build error
  constructor(public scene: Phaser.Scene) {}

  public get isOpen(): boolean {
    return this.open;
  }

  // Converts Figma top-left coords to Phaser centered local coords
  protected alignCoords(bg: Phaser.GameObjects.Image, x: number, y: number): Position {
    return {
      x: x - bg.width / 2,
      y: y - bg.height / 2,
    };
  }

  protected openBoard(): void {
    this.board?.setVisible(true);
    this.open = true;
  }

  protected closeBoard(): void {
    this.board?.setVisible(false);
    this.open = false;
    this.hoverEffect?.destroy();
    this.hoverEffect = null;
  }

  protected attachListeners(target: Phaser.GameObjects.Image, handlers: Handlers): void {
    target
      .on('pointerover', handlers.onOver)
      .on('pointerout', handlers.onOut)
      .on('pointerdown', handlers.onDown)
      .on('pointerup', handlers.onUp);
  }

  protected createButtonHandlers(target: Phaser.GameObjects.Image, pos: Position): Handlers {
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
      onDown: () => {
        createEffect(BUTTON_HOVERS.POINTERDOWN.COLOR, BUTTON_HOVERS.POINTERDOWN.ALPHA, 1);
        ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.DEFAULT_CLICK);
      },
      onUp: () => {},
    };
  }

  protected removeHoverEffect(): void {
    if (this.hoverEffect) {
      this.board?.remove(this.hoverEffect);
      this.hoverEffect.destroy();
      this.hoverEffect = null;
    }
  }
}
