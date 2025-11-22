import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { ARCANE_MIND } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { SpellPower } from '@/components/stats/damage';

export class ArcaneMind implements Modifier {
  public id = ARCANE_MIND.id;
  public duration = ARCANE_MIND.duration;
  public type = ARCANE_MIND.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    if (!target.getDead()) {
      const spellPower = target.getStats().damage.spellPower as SpellPower;
      spellPower.allowInstantCast = true;
    }
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.scene.time.delayedCall(this.duration, () => {
      if (target && !target.getDead()) {
        const spellPower = target.getStats().damage.spellPower as SpellPower;
        const targetModifier = target?.getModifier();
        if (targetModifier.isModifierExist(ARCANE_MIND.id)) {
          spellPower.allowInstantCast = false;
          targetModifier.removeModifier(ARCANE_MIND.id);
          this.ui.removeModifierIcon(this.id);
        }
        onExpire();
      }
    });
  }
}
