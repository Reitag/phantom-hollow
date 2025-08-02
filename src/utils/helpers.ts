import Phaser from 'phaser';

export function isArcadePhysicsBody(
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | MatterJS.BodyType | null
): body is Phaser.Physics.Arcade.Body {
  if (body === undefined || body === null) {
    return false;
  }
  return body instanceof Phaser.Physics.Arcade.Body;
}

export function isAnimationKeyExist(...keys: (string | undefined)[]): boolean {
  return keys.every((key) => typeof key === 'string' && key.length > 0);
}
