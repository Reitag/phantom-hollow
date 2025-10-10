import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { DISEASE } from '@/constants/modifier-stats';
import { Character } from '@/base/entites/character';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class Disease implements Modifier {
  public id = DISEASE.id;
  public duration = DISEASE.duration;
  public type = DISEASE.type;

  private ui: UiSystem;
  private tick!: Phaser.Time.TimerEvent;

  constructor(
    private scene: Phaser.Scene,
    private damagePerTick = DISEASE.damage
  ) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    if (target.getDead()) {
      this.tick.remove();
    }
    target.takeDamage(this.damagePerTick);
  }

  public start(target: Character, onExpire: () => void): void {
    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.tick = this.scene.time.addEvent({
      delay: 1000,
      repeat: this.duration / 1000 - 1,
      callback: () => this.apply(target),
      callbackScope: this,
    });

    this.scene.time.delayedCall(this.duration, () => {
      this.ui.removeModifierIcon(this.id);
      onExpire();
    });
  }
}
