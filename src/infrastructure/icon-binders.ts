import { IconHandler, IconClickContext, IconDragContext } from '@/utils/types';

type Handlers = {
  over: IconHandler;
  out: IconHandler;
  down: IconHandler;
  up: IconHandler;
};

export class IconClickBinder {
  private handlers = new Map<Phaser.GameObjects.Image, Handlers>();

  public set(icon: Phaser.GameObjects.Image, index: number, ctx: IconClickContext): void {
    if (!icon || this.handlers.has(icon)) return;

    icon.setInteractive();

    const over: IconHandler = () => ctx.onHover(index);
    const out: IconHandler = () => ctx.onHoverOut();
    const down: IconHandler = () => ctx.onPress(index);
    const up: IconHandler = () => ctx.onRelease(index);

    this.handlers.set(icon, { over, out, down, up });
  }

  public bind(icon: Phaser.GameObjects.Image): void {
    const h = this.handlers.get(icon);
    if (!h) return;

    icon.on('pointerover', h.over);
    icon.on('pointerout', h.out);
    icon.on('pointerdown', h.down);
    icon.on('pointerup', h.up);
  }

  public unbind(icon: Phaser.GameObjects.Image): void {
    const h = this.handlers.get(icon);
    if (!h) return;

    icon.off('pointerover', h.over);
    icon.off('pointerout', h.out);
    icon.off('pointerdown', h.down);
    icon.off('pointerup', h.up);
  }

  public isBound(icon: Phaser.GameObjects.Image): boolean {
    return this.handlers.has(icon);
  }

  public delete(icon: Phaser.GameObjects.Image): void {
    if (!icon || !this.handlers.has(icon)) return;

    this.handlers.delete(icon);
  }
}

type DragHandlers = {
  over: IconHandler;
  out: IconHandler;
  dragstart: IconHandler;
  drag: IconHandler;
  dragend: IconHandler;
};

export class IconDragBinder {
  private handlers = new Map<Phaser.GameObjects.Image, DragHandlers>();

  constructor(private scene: Phaser.Scene) {}

  public set(icon: Phaser.GameObjects.Image, ctx: IconDragContext): void {
    if (!icon || this.handlers.has(icon)) return;

    this.scene.input.setDraggable(icon);

    const over: IconHandler = () => {
      ctx.onHover(icon);
    };

    const out: IconHandler = () => {
      ctx.onHoverOut();
    };

    const dragstart: IconHandler = () => {
      ctx.onDragStart(icon);
    };

    const drag: IconHandler = (_p, x, y) => {
      ctx.onDrag(icon, x, y);
    };

    const dragend: IconHandler = (pointer) => {
      ctx.onDragEnd(icon, pointer);
    };

    this.handlers.set(icon, { over, out, dragstart, drag, dragend });
  }

  public bind(icon: Phaser.GameObjects.Image): void {
    const h = this.handlers.get(icon);
    if (!h) return;

    icon.on('pointerover', h.over);
    icon.on('pointerout', h.out);
    icon.on('dragstart', h.dragstart);
    icon.on('drag', h.drag);
    icon.on('dragend', h.dragend);
  }

  public unbind(icon: Phaser.GameObjects.Image): void {
    const h = this.handlers.get(icon);
    if (!h) return;

    icon.off('pointerover', h.over);
    icon.off('pointerout', h.out);
    icon.off('dragstart', h.dragstart);
    icon.off('drag', h.drag);
    icon.off('dragend', h.dragend);
  }

  public isBound(icon: Phaser.GameObjects.Image): boolean {
    return this.handlers.has(icon);
  }

  public delete(icon: Phaser.GameObjects.Image): void {
    if (!icon || !this.handlers.has(icon)) return;

    this.handlers.delete(icon);
  }
}
