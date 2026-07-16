import { FIRE_ENERGY } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpellPower } from '@/components/stats/damage';

export class FireEnergy implements Modifier {
  public id = FIRE_ENERGY.id;
  public duration = 0;
  public type = FIRE_ENERGY.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const spellPower = target.getStats().damage.spellPower as SpellPower;
    spellPower.allowCriticalStrike = true;
    spellPower.allowInstantCast = true;
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);
  }
}
