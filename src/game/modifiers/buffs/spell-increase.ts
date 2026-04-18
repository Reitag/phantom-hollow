import { AUDIO } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SPELL_POWER } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { SpellPower } from '@/components/stats/damage';
import { Modifier } from '@/utils/types';

export class SpellIncrease implements Modifier {
  public id = SPELL_POWER.id;
  public duration = SPELL_POWER.duration;
  public type = SPELL_POWER.type;

  private ui: UiSystem;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public apply(target: Character): void {
    const spellPower = target?.getStats().damage.spellPower as SpellPower;

    spellPower.addMultiplier(this.id, SPELL_POWER.effect);
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.SPELL_POWER);
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.scene.time.delayedCall(this.duration, () => {
      const spellPower = target?.getStats().damage.spellPower as SpellPower;
      spellPower?.removeMultiplier(this.id);
      this.ui.removeModifierIcon(this.id);
      onExpire();
    });
  }
}
