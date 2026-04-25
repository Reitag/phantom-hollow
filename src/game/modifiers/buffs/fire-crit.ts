import { AUDIO } from '@/constants/asset-keys';
import { FIRE_CRIT } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class FireCrit implements Modifier {
  public id = FIRE_CRIT.id;
  public duration = 0;
  public type = FIRE_CRIT.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {}

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, undefined, this.type);
  }
}
