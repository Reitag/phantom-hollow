export const PLAYER_SPAWN_POSITION = { x: 50, y: 450 };
//export const PLAYER_SPAWN_POSITION = { x: 15000, y: 450 };

export const DESTROY_TIME = 10_000;
export const RESPAWN_TIME = 150_000;

export const SKELETONS_SPAWN_POSITION = [
  { x: 540, y: 520 },
  { x: 1290, y: 520 },
  { x: 2360, y: 520 },
  { x: 3380, y: 328 },
  { x: 3530, y: 456 },
  { x: 2250, y: 328 },
  { x: 2590, y: 328 },
  { x: 6210, y: 488 },
  { x: 7050, y: 520 },
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
  { x: 5760, y: 520 },
  { x: 7290, y: 520 },
  { x: 10941, y: 488 },
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
  { x: 10071, y: 264 },
  { x: 10420, y: 328 },
].map((pos) => ({
  x: pos.x,
  y: pos.y,
  isSpawned: false,
}));

export const EVIL_WIZZARD_SPAWN_POSITION = { x: 15633, y: 392 };
