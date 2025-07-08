import Phaser from 'phaser';

type RoundedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
};

type SquareOverlay = {
  x: number;
  y: number;
  size: number;
};

export class GraphicsMask extends Phaser.GameObjects.Graphics {
  private shape: Phaser.GameObjects.Graphics;
  public mask: Phaser.Display.Masks.GeometryMask;
  private color: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);

    this.shape = scene.add.graphics();
    this.mask = this.shape.createGeometryMask();
    this.shape.visible = false;
    this.color = 0xffffff;
  }

  roundedRect({ x, y, width, height, radius = height / 2 }: RoundedRect): this {
    this.shape.fillStyle(this.color);
    this.shape.fillRoundedRect(x, y - height / 2, width, height, radius);

    return this;
  }

  squareOverlay({ x, y, size }: SquareOverlay): this {
    this.shape.fillStyle(this.color);
    this.shape.fillRect(x, y, size, size);

    return this;
  }

  applyTo(
    gameObject: Phaser.GameObjects.Image | Phaser.GameObjects.Graphics
  ): Phaser.GameObjects.Graphics {
    gameObject.setMask(this.mask);

    return this.shape;
  }
}
