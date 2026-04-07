import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { LIGHTNING_SHIELD, PROTECTION } from '@/constants/modifier-stats';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Modifier } from '@/utils/types';
import { SpellFactory } from '@/factories/spell-factory';
import { LightningShield } from '@/entities/spells/effect-spells/lightning-shield';

export class SetLightning implements Modifier {
  public id = LIGHTNING_SHIELD.id;
  public duration = LIGHTNING_SHIELD.duration;
  public type = LIGHTNING_SHIELD.type;

  private ui: UiSystem;
  private spellFactory: SpellFactory;
  private lightningShield: LightningShield | null = null;
  private timer: Phaser.Time.TimerEvent | undefined = undefined;

  constructor(private scene: Phaser.Scene) {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  }

  public apply(target: Character): void {
    // Sound is creating in Lightning Sheild class as it acts like a spell, not modifier
    this.lightningShield = this.spellFactory.createLightningShield(target);
  }

  public start(target: Character, onExpire: () => void): void {
    this.apply(target);

    this.ui.addModifierIcon(this.id, this.duration, this.type);

    this.scene.events.once('lightning-shield-expired', () => {
      this.cleanup(onExpire);
    });

    this.timer = this.scene.time.delayedCall(this.duration, () => {
      this.cleanup(onExpire);
    });
  }

  private cleanup(onExpire: () => void): void {
    if (!this.lightningShield) return;

    this.lightningShield.destroy();
    this.lightningShield = null;

    this.ui.removeModifierIcon(this.id);

    this.timer?.remove(false);

    onExpire();
  }
}
