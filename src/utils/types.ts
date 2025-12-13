import { Defense } from '@/components/stats/defense';
import { Health } from '@/components/stats/health';
import { Damage } from '@/components/stats/damage';
import { Speed } from '@/components/stats/speed';
import { TYPE } from '@/constants/modifier-stats';
import { Character } from '@/base/objects/character';
import { Aggro } from '@/components/stats/aggro';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;

// Border
export type Border = {
  left: number;
  center: number;
  right: number;
};

// Sprite
export interface SpriteConfig {
  scene: Phaser.Scene;
  position: Position;
  keyName: string;
  frame?: number;
}

// Animation
export type AnimationMap = Record<string, string>;

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
  aggro: Aggro | null;
}

// Inventory Slots
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  maxStack: number;
  isUnique: boolean;
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

// Spawn Enemies
export interface EnemySpawnData {
  x: number;
  y: number;
  type: string;
  isSpawned: boolean;
  isAlive: boolean;
}

export interface SpawnPoint extends Position {
  isSpawned: boolean;
  isAlive: boolean;
}

// Trigger Keys
export type Triggerkey = 'fire-worm' | 'evil-wizard';

// Tooltip params
export type TooltipFrameConfig = {
  x: number;
  y: number;
  width: number;
  height?: number | undefined;
  fillColor?: number | undefined;
  fillAlpha?: number | undefined;
};

type PropConfig = {
  param?: {
    fontSize?: string | undefined;
    fontStyle?: string | undefined;
    color?: string | undefined;
  };
  text: string;
};

export type TooltipContentConfig = {
  id?: string | undefined;
  title?: PropConfig | undefined;
  prop_1?: PropConfig | undefined;
  prop_2?: PropConfig | undefined;
  prop_3?: PropConfig | undefined;
  prop_4?: PropConfig | undefined;
};
