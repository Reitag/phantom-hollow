import Phaser from 'phaser';

export class StaticObject extends Phaser.Physics.Arcade.StaticGroup {
  constructor({ scene, objects }) {

    super(scene.physics.world, scene);

    objects.forEach(({ objectName, position, scale = 1 }) => {
      this.createStaticObject(objectName, position, scale);
    });
  }

  createStaticObject(objectName, position, scale) {
    const { x, y } = position;

    const object = this.create(x, y, objectName);

    if (scale !== 1) {
      object.setScale(scale).refreshBody();
    }
  }
}
