export const Z_POSITION = {
  // Environment
  /// -backgound
  SKY: 0,
  MOUNTAINS: 10,
  GRASS: 20,
  /// -objects
  TREES_SHADOW: 30,
  TREES_NORMAL: 40,
  /// -backgrounds
  PLATFORM_BG: 50,
  CAVE_BACKGROUND: 60,
  /// -spear and bush
  SPEAR: 70,
  BUSH: 80,
  /// -cave
  CAVE: 90,
  /// -tilesets
  GROUND: 110,
  SPIKE: 120,
  PLATFORMS: 130,

  // Sprite objects
  PORTAL: 140,
  PLAYER: 150,
  ENEMY: 160,
  SPELL: 170,

  // Collide layer
  COLLIDE: 900,

  // UI
  UI: 1000,
} as const;
