import {
  DISEASE,
  PROTECTION,
  SHADOW_VULNERABILITY,
  SPELL_POWER,
  UNDYING,
} from '@/constants/modifier-stats';
import { Protection } from '@/game/modifiers/buffs/protection';
import { SpellIncrease } from '@/game/modifiers/buffs/spell-increase';
import { Undying } from '@/game/modifiers/buffs/undying';
import { Disease } from '@/game/modifiers/debuffs/disease';
import { ShadowVulnerability } from '@/game/modifiers/debuffs/shadow-vulnerability';
import { Modifier } from '@/utils/types';

export class ModifierFactory {
  static create(scene: Phaser.Scene, type: string): Modifier {
    switch (type) {
      case PROTECTION.id:
        return new Protection(scene);
      case SPELL_POWER.id:
        return new SpellIncrease(scene);
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
