import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { PROTECTION } from '@/constants/modifier-stats';
import { UiManager } from '@/managers/ui-manager';
import { Character } from '@/objects/core/character';
import { Modifier } from '../core/modifier';

export class Protection implements Modifier {
  public id = PROTECTION.id;
  public duration = PROTECTION.duration;
  public type = PROTECTION.type;

  private ui: UiManager;

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
