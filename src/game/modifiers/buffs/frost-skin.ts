import { Character } from '@/base/objects/character';
import { FROST_SKIN } from '@/constants/modifier-stats';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class FrostSKin implements Modifier {
  public id = FROST_SKIN.id;
  public duration = 0;
  public type = FROST_SKIN.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const stats = target.getStats();

    if (stats.health) {
      stats.health.current = FROST_SKIN.health;
      this.ui.reducePlayerHealth(stats.health.current, stats.health.max);
    }
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, undefined, this.type);
  }
}
