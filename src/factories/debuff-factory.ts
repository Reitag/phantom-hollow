import { DISEASE } from '@/constants/modifier-stats';
import { Disease } from '@/modifiers/debuffs/disease';
import { Debuff } from '@/modifiers/core/debuff';

export class DebuffFactory {
  static create(scene: Phaser.Scene, type: string): Debuff {
    switch (type) {
      case DISEASE.id:
        return new Disease(scene);
      default:
        throw new Error(`Unknown debuff: ${type}`);
    }
  }
}
