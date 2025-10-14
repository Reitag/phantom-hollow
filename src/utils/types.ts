import { Defense } from '@/components/stats/defense';
import { Health } from '@/components/stats/health';
import { Damage } from '@/components/stats/damage';
import { Speed } from '@/components/stats/speed';
import { TYPE } from '@/constants/modifier-stats';
import { Character } from '@/base/objects/character';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;

// Physics Arcade Sprite
export interface ArcadeSpriteConfig {
  scene: Phaser.Scene;
  position: Position;
  keyName: string;
  frame?: number;
}

// Animation
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

export type ItemAnimationConfig = {
  idle?: string;
};

// Stats
export interface Stats {
  health: Health | null;
  speed: Speed | null;
  damage: Record<string, Damage | null>;
  defense: Defense | null;
}

// Inventory Slots
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  maxStack: number;
  use: () => boolean;
}

export interface InventorySlot {
  item: InventoryItem;
  quantity: number;
}

// Buffs and Debuffs
export interface Modifier {
  id: string;
  duration: number;
  type: ModifierType;

  apply(target: Character): void;
  start(target: Character, onExpire: () => void): void;
}

export type ModifierType = (typeof TYPE)[keyof typeof TYPE];
