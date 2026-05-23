import { Character } from '@/base/objects/character';
import { FROSTBITE } from '@/constants/modifier-stats';
import { Z_POSITION } from '@/constants/z-position';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';
import { Modifier } from '@/utils/types';

export class FrostBite implements Modifier {
  public id = FROSTBITE.id;
  public duration = FROSTBITE.duration;
  public type = FROSTBITE.type;

  // For icon
  private icon: Phaser.GameObjects.Image | null = null;
  private target: Character | null = null;

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
      /*stats.damage.meleeAttack?.addMultiplier(this.id, FROSTBITE.getDamageEffect(this.hasRelic));
      stats.damage.spellPower?.addMultiplier(this.id, FROSTBITE.getDamageEffect(this.hasRelic));*/
      stats.defense?.addModifier(this.id, FROSTBITE.effect);
    } else {
      target.anims.timeScale = 0.5;
      stats.speed?.addModifier(this.id, FROSTBITE.speed_effect);
    }
  }

  public start(target: Character, onExpire: () => void): void {
    this.target = target;
    this.apply(target);

    if (target instanceof Player) {
      // Need new icon
      this.ui.addModifierIcon(this.id, this.duration, this.type);
    } else {
      this.icon = this.scene.add.image(target.x, target.y - 40, this.id);
      this.icon.setScale(0.5);
      this.icon.setDepth(Z_POSITION.UI);

      this.scene.events.on('postupdate', this.updateIconPosition, this);
    }

    this.scene.time.delayedCall(this.duration, () => {
      const stats = target.getStats();
      const isBoss = this.bossNames.includes(target.constructor.name);

      if (isBoss) {
        /*stats.damage.meleeAttack?.removeMultiplier(this.id);
        stats.damage.spellPower?.removeMultiplier(this.id);*/
        stats.defense?.removeModifier(this.id);
      } else {
        if (target && target.active) {
          target.anims.timeScale = 1;
        }
        stats.speed?.removeModifier(this.id);
      }
      if (target instanceof Player) {
        // Same here
        this.ui.removeModifierIcon(this.id);
      } else {
        this.scene.events.off('postupdate', this.updateIconPosition, this);

        if (this.icon) {
          this.icon.destroy();
          this.icon = null;
        }
      }
      onExpire();
    });
  }

  private updateIconPosition(): void {
    if (this.icon && this.target && this.target.active) {
      this.icon.x = this.target.x;
      this.icon.y = this.target.y - 40;
    }
  }
}
