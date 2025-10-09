import { DISEASE, PROTECTION, SHADOW_VULNERABILITY, UNDYING } from '@/constants/modifier-stats';
import { Protection } from '@/modifiers/buffs/protection';
import { Undying } from '@/modifiers/buffs/undying';
import { Modifier } from '@/modifiers/core/modifier';
import { Disease } from '@/modifiers/debuffs/disease';
import { ShadowVulnerability } from '@/modifiers/debuffs/shadow-vulnerability';

export class ModifierFactory {
  static create(scene: Phaser.Scene, type: string): Modifier {
    switch (type) {
      case PROTECTION.id:
        return new Protection(scene);
      case UNDYING.id:
        return new Undying(scene);
      case DISEASE.id:
        return new Disease(scene);
      case SHADOW_VULNERABILITY.id:
        return new ShadowVulnerability(scene);
      default:
        throw new Error(`Unknown modifier: ${type}`);
    }
  }
}
