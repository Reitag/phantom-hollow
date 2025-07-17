export function createZoneRectangle({ scene, position, size }) {
  const { x, y } = position;
  const { width, height } = size;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone);

  zone.body.setAllowGravity(false);
  zone.body.setImmovable(true);

  return zone;
}
