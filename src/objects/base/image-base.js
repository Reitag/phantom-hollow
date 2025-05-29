import Phaser from "phaser";

export class ImageBase extends Phaser.GameObjects.Image {
  constructor(
    scene,
    position,
    texture,
    originX = 0.5,
    originY = 0.5,
    frame = null
  ) {
    const { x, y } = position;
    super(scene, x, y, texture, frame);

    this.setOrigin(originX, originY);
    scene.add.existing(this);
  }
}
