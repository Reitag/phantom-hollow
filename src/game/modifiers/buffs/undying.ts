import { Character } from '@/base/objects/character';
import { AUDIO } from '@/constants/asset-keys';
import { Health } from '@/components/stats/health';
import { UNDYING } from '@/constants/modifier-stats';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class Undying implements Modifier {
  public id = UNDYING.id;
  public duration = UNDYING.duration;
  public type = UNDYING.type;

  private ui: UiSystem;
  private originalApplyDamage!: (amount: number) => void;
  private savedOnExpire!: () => void;
  private health!: Health | null;
  private hasTrigged = false;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    if (!this.health) return;

    this.originalApplyDamage = this.health.applyDamage.bind(this.health);
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.UNDYING);

    this.health.applyDamage = (amount: number) => {
      if (!this.health) return;

      if (!(this.health.current - amount <= UNDYING.hp_left)) {
        this.originalApplyDamage(amount);
      } else {
        if (!this.hasTrigged) {
          this.hasTrigged = true;
          this.ui.removeModifierIcon(this.id);
          this.ui.addModifierIcon(this.id, this.duration, this.type);

          //
          this.scene.cameras.main.flash(150, 255, 0, 0);
          this.scene.cameras.main.shake(120, 0.01);

          SaveService.patch({
            buffs: SaveService.data.buffs.filter((buffId) => buffId !== this.id),
          });

          //

          this.scene.time.delayedCall(this.duration, () => {
            if (!this.health) return;

            this.health.applyDamage = this.originalApplyDamage;
            this.ui.removeModifierIcon(this.id);
            target.clearTint();
            this.savedOnExpire();
          });
        }
        const newValue = this.health.current - UNDYING.hp_left;
        this.originalApplyDamage(newValue);
      }
    };
  }

  public start(target: Character, onExpire: () => void): void {
    this.health = target.getStats().health;
    if (!this.health) return;

    this.apply(target);

    this.ui.addModifierIcon(this.id, undefined, this.type);
    this.savedOnExpire = onExpire;

    const save = ServiceLocator.resolve(ServiceKeys.save);
    if (!save?.buffs.includes(this.id)) {
      SaveService.patch({
        buffs: [...SaveService.data.buffs, this.id],
      });
    }
  }
}
