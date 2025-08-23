import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { DISEASE } from '@/constants/modifier-stats';
import { UiManager } from '@/managers/ui-manager';
import { Character } from '@/objects/core/character';
import { Debuff } from '../core/debuff';

export class Disease implements Debuff {
  id = DISEASE.id;
  duration = DISEASE.duration;

  private ui: UiManager;
  private tick!: Phaser.Time.TimerEvent;

  constructor(
    private scene: Phaser.Scene,
    private damagePerTick = DISEASE.damage
  ) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    if (target.getDead()) {
      this.ui.removeDebuffIcon(this.id);
      this.tick.remove();
    }
    target.takeDamage(this.damagePerTick);
  }

  public start(target: Character, onExpire: () => void): void {
    this.ui.setDebuffIcon(this.id, this.duration);

    this.tick = this.scene.time.addEvent({
      delay: 1000,
      repeat: this.duration / 1000 - 1,
      callback: () => this.apply(target),
      callbackScope: this,
    });

    this.scene.time.delayedCall(this.duration, () => {
      this.ui.removeDebuffIcon(this.id);
      onExpire();
    });
  }
}
