import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { CONCENTRATION } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';

export class Concentration implements Modifier {
  public id = CONCENTRATION.id;
  public duration = 0;
  public type = CONCENTRATION.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const stats = target.getStats();
    stats.casting?.addMultiplier(this.id, CONCENTRATION.effect);
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, undefined, this.type);
  }
}
