import { AUDIO } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { CONCENTRATION } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { SaveService } from '@/infrastructure/save-service';

export class Concentration implements Modifier {
  public id = CONCENTRATION.id;
  public duration = 0;
  public type = CONCENTRATION.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const stats = target.getStats();
    // Check if the buff is being restored from a save file (set in player-handler in the Systems directory)
    const isLoading = this.scene.registry.get('is_loading_save');

    if (stats.casting) {
      stats.casting.addMultiplier(this.id, CONCENTRATION.effect);
      // Only play the activation sound during active gameplay, not during save loading
      if (!isLoading) ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.CONCENTRATION);
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
