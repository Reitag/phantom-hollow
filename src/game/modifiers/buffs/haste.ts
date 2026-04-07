import { AUDIO } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { HASTE } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { SaveService } from '@/infrastructure/save-service';

export class Haste implements Modifier {
  public id = HASTE.id;
  public duration = 0;
  public type = HASTE.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const stats = target.getStats();

    if (stats.speed) {
      stats.speed.addModifier(this.id, HASTE.effect);
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.HASTE);
    }
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, undefined, this.type);

    const save = ServiceLocator.resolve(ServiceKeys.save);
    if (!save?.buffs.includes(this.id)) {
      SaveService.patch({
        buffs: [...SaveService.data.buffs, this.id],
      });
    }
  }
}
