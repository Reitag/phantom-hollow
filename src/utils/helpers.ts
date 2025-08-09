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

export function isValidTeleportPosition(
  layers: Phaser.Tilemaps.TilemapLayer[] | null
): (x: number, y: number) => boolean {
  return (x: number, y: number): boolean => {
    if (!layers || layers.length === 0) {
      return true;
    }

    for (const layer of layers) {
      const tile = layer.getTileAtWorldXY(x, y);
      if (tile && tile.collides) {
        return false;
      }
    }

    return true;
  };
}

export function playAnimation(
  object: Phaser.GameObjects.Sprite,
  key: string | undefined,
  force = false
): void {
  if (!object || !key) return;
  if (!force && object.anims.currentAnim?.key === key) return;
  object.anims.play(key, true);
}
