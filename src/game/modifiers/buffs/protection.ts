import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { PROTECTION } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/entites/character';
import { Modifier } from '@/utils/types';

export class Protection implements Modifier {
  public id = PROTECTION.id;
  public duration = PROTECTION.duration;
  public type = PROTECTION.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const stats = target.getStats();
    stats.defense?.addModifier(this.id, PROTECTION.effect);
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.scene.time.delayedCall(this.duration, () => {
      const defense = target.getStats().defense;
      defense?.removeModifier(this.id);
      this.ui.removeModifierIcon(this.id);
      onExpire();
    });
  }
}
