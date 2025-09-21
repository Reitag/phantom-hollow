export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;

export type AnimationConfig = {
  idle?: string;
  moveLeft?: string;
  moveRight?: string;
  attack?: string;
  instantCast?: string;
  death?: string;
};

export type SpellAnimationConfig = {
  main?: string;
  destroy?: string;
};

export interface PhysicsSpriteConfig {
  scene: Phaser.Scene;
  position: Position;
  keyName: string;
  frame?: number;
}
