import Phaser from 'phaser';

export class ArcadeSpriteBase extends Phaser.Physics.Arcade.Sprite {
  constructor({ scene, position, keyName, frame }) {
    const { x, y } = position;
    super(scene, x, y, keyName, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.keyName = keyName;
  }
}
