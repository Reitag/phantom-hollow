import { Character } from '@/base/objects/character';
import { FROSTBITE } from '@/constants/modifier-stats';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class FrostBite implements Modifier {
  public id = FROSTBITE.id;
  public duration = FROSTBITE.duration;
  public type = FROSTBITE.type;

  private ui: UiSystem;
  private hasRelic = false;
  private bossNames = ['FireWorm', 'EvilWizzard'];

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public set relic(value: boolean) {
    this.hasRelic = value;
  }

  public apply(target: Character): void {
    const stats = target.getStats();
    const isBoss = this.bossNames.includes(target.constructor.name);

    if (isBoss) {
      stats.damage.meleeAttack?.addMultiplier(this.id, FROSTBITE.getDamageEffect(this.hasRelic));
      stats.damage.spellPower?.addMultiplier(this.id, FROSTBITE.getDamageEffect(this.hasRelic));
    } else {
      target.anims.timeScale = 0.5;
      stats.speed?.addModifier(this.id, FROSTBITE.speed_effect);
    }
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    if (target instanceof Player) {
      // Need new icon
      this.ui.addModifierIcon(this.id, this.duration, this.type);
    }

    this.scene.time.delayedCall(this.duration, () => {
      const stats = target.getStats();
      const isBoss = this.bossNames.includes(target.constructor.name);

      if (isBoss) {
        stats.damage.meleeAttack?.removeMultiplier(this.id);
        stats.damage.spellPower?.removeMultiplier(this.id);
      } else {
        if (target && target.active) {
          target.anims.timeScale = 1;
        }
        stats.speed?.removeModifier(this.id);
      }
      if (target instanceof Player) {
        // Same here
        this.ui.removeModifierIcon(this.id);
      }
      onExpire();
    });
  }
}
