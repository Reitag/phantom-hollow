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
    // Check if the buff is being restored from a save file (set in player-handler in the Systems directory)
    const isLoading = this.scene.registry.get('is_loading_save');

    if (stats.speed) {
      stats.speed.addModifier(this.id, HASTE.effect);
      // Only play the activation sound during active gameplay, not during save loading
      if (!isLoading) ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.HASTE);
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
