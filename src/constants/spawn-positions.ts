//export const PLAYER_SPAWN_POSITION = { x: 50, y: 450 };
export const PLAYER_SPAWN_POSITION = { x: 12100, y: 520 };
//export const PLAYER_SPAWN_POSITION = { x: 15600, y: 400 };

export const DESTROY_TIME = 20_000;
export const RESPAWN_TIME = 250_000;

export const SKELETONS_SPAWN_POSITION = [
  { x: 540, y: 520 },
  { x: 1290, y: 520 },
  { x: 2360, y: 520 },
  { x: 3380, y: 328 },
  { x: 3530, y: 456 },
  { x: 2250, y: 328 },
  { x: 2590, y: 328 },
  { x: 5050, y: 520 },
  { x: 5472, y: 520 },
  { x: 6210, y: 488 },
  { x: 7050, y: 520 },
  { x: 8766, y: 520 },
  { x: 9620, y: 488 },
  { x: 10180, y: 488 },
  { x: 11310, y: 520 },
  { x: 13275, y: 136 },
  { x: 13340, y: 520 },
  { x: 13600, y: 392 },
  { x: 13980, y: 168 },
  { x: 14000, y: 296 },
  { x: 14200, y: 552 },
].map((pos) => ({
  x: pos.x,
  y: pos.y,
  isSpawned: false,
}));

export const ZOMBIES_SPAWN_POSITION = [
  { x: 1650, y: 520 },
  { x: 2670, y: 488 },
  { x: 3080, y: 392 },
  { x: 3060, y: 520 },
  { x: 3335, y: 520 },
  { x: 3420, y: 200 },
  { x: 5266, y: 520 },
  { x: 5370, y: 328 },
  { x: 5757, y: 520 },
  { x: 7290, y: 520 },
  { x: 9050, y: 520 },
  { x: 11558, y: 520 },
  { x: 13120, y: 456 },
  { x: 13600, y: 200 },
  { x: 13900, y: 424 },
].map((pos) => ({
  x: pos.x,
  y: pos.y,
  isSpawned: false,
}));

export const ARCHERS_SPAWN_POSITION = [
  { x: 4867, y: 392 },
  { x: 6063, y: 200 },
  { x: 6616, y: 296 },
  { x: 6731, y: 392 },
  { x: 9359, y: 328 },
  { x: 10071, y: 264 },
  { x: 10420, y: 328 },
  { x: 10703, y: 328 },
  { x: 11122, y: 328 },
  { x: 14420, y: 296 },
  { x: 14647, y: 136 },
  { x: 14945, y: 136 },
  { x: 15166, y: 136 },
].map((pos) => ({
  x: pos.x,
  y: pos.y,
  isSpawned: false,
}));

export const EVIL_WIZZARD_SPAWN_POSITION = { x: 15650, y: 400 };
