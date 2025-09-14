import { DISEASE, SHADOW_VULNERABILITY } from '@/constants/modifier-stats';
import { Modifier } from '@/modifiers/core/modifier';
import { Disease } from '@/modifiers/debuffs/disease';
import { ShadowVulnerability } from '@/modifiers/debuffs/shadow-vulnerability';

export class ModifierFactory {
  static create(scene: Phaser.Scene, type: string): Modifier {
    switch (type) {
      case DISEASE.id:
        return new Disease(scene);
      case SHADOW_VULNERABILITY.id:
        return new ShadowVulnerability(scene);
      default:
        throw new Error(`Unknown debuff: ${type}`);
    }
  }
}
