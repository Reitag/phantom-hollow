import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Health } from '@/components/stats/health';
import { UNDYING } from '@/constants/modifier-stats';
import { Character } from '@/base/objects/character';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class Undying implements Modifier {
  public id = UNDYING.id;
  public duration = UNDYING.duration;
  public type = UNDYING.type;

  private ui: UiSystem;
  private originalApplyDamage!: (amount: number) => void;
  private health!: Health | null;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    if (!this.health) return;

    this.originalApplyDamage = this.health.applyDamage.bind(this.health);

    this.health.applyDamage = (amount: number) => {
      if (!this.health) return;

      if (this.health.current === UNDYING.hp_left) return;

      if (!(this.health.current - amount <= UNDYING.hp_left)) {
        this.originalApplyDamage(amount);
      } else {
        const newValue = this.health.current - UNDYING.hp_left;
        this.originalApplyDamage(newValue);
      }
    };
  }

  public start(target: Character, onExpire: () => void): void {
    this.health = target.getStats().health;
    if (!this.health) return;

    this.apply(target);

    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.scene.time.delayedCall(this.duration, () => {
      if (!this.health) return;

      this.health.applyDamage = this.originalApplyDamage;
      this.ui.removeModifierIcon(this.id);
      onExpire();
    });
  }
}
