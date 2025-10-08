import { Defense } from '@/components/stats/defense';
import { Health } from '@/components/stats/health';
import { MeleeAttack } from '@/components/stats/melee-attack';
import { Speed } from '@/components/stats/speed';

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

export interface Stats {
  health: Health | null;
  speed: Speed | null;
  meleeAttack: MeleeAttack | null;
  defense: Defense | null;
}
