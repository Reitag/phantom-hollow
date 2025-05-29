import Phaser from "phaser";

export class GraphicsMask extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.shape = scene.add.graphics();
    this.mask = this.shape.createGeometryMask();
    this.shape.visible = false;
    this.color = 0xffffff;
  }

  roundedRect({ x, y, width, height, radius = height / 2 }) {
    this.shape.fillStyle(this.color);
    this.shape.fillRoundedRect(x, y - height / 2, width, height, radius);
    return this;
  }

  squareOverlay({ x, y, size }) {
    this.shape.fillStyle(this.color);
    this.shape.fillRect(x, y, size, size);
    return this;
  }

  applyTo(gameObject) {
    gameObject.setMask(this.mask);
    return this.shape;
  }
}
