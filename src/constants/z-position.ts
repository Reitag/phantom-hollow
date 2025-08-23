export const Z_POSITION = {
  // Environment
  /// -backgound
  SKY: 0,
  MOUNTAINS: 10,
  GRASS: 20,
  /// -objects
  TREES_SHADOW: 30,
  TREES_NORMAL: 40,
  SPEAR: 50,
  BUSH: 60,
  /// -tilesets
  GROUND: 70,
  SPIKE: 80,
  PLATFORMS: 90,

  // Sprite objects
  PORTAL: 100,
  PLAYER: 110,
  ENEMY: 120,
  SPELL: 130,

  // Collide layer
  COLLIDE: 900,

  // UI
  UI: 1000,
} as const;
