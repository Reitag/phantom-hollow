export const Z_POSITION = {
  // Spawn
  SPAWN: -1000,

  // Environment
  /// -backgound
  SKY: 0,
  MOUNTAINS: 10,
  GRASS: 20,
  /// -objects
  TREES_SHADOW: 30,
  TREES_NORMAL: 40,
  ROCK: 50,
  /// -backgrounds
  CAVE_BACKGROUND: 60,
  PLATFORM_BG: 70,
  /// -spear and bush
  SPEAR: 80,
  BUSH: 90,
  /// -store and decor
  DECOR: 100,
  STORE: 110,
  /// -cave
  CAVE: 120,
  /// -tilesets
  GROUND: 130,
  SPIKE: 140,
  PLATFORMS: 150,

  // Sprite objects
  ITEM: 160,
  PLAYER: 170,
  ENEMY: 180,
  SPELL: 190,
  MISC: 200,

  // UI
  UI: 1000,
} as const;
