import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { AUDIO } from '@/constants/asset-keys';
import { LIGHTNING_SHIELD } from '@/constants/modifier-stats';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class LightningShield extends Spell {
  private capacity: number;
  private audio: Phaser.Sound.BaseSound | undefined = undefined;

  constructor({ scene, position, keyName, frame, caster, spellPower, damage }: SpellConfig) {
    super({ scene, position, keyName, frame, caster, spellPower, damage });
    this.capacity = LIGHTNING_SHIELD.damage_absorb;

    this.audioKeys = {
      launch: undefined,
      impact: AUDIO.LIGHTNING_SHIELD_ABSORB,
      action: AUDIO.LIGHTNING_SHIELD_ACTION,
    };

    this.anims.play(SPELLS_ANIMATION.LIGHTNING_SHIELD.MAIN);
    this.setSize(100, 100);

    if (this.audioKeys.action) {
      this.audio = ServiceLocator.resolve(ServiceKeys.audio).playControlled(this.audioKeys.action);
    }

    this.caster.setLightningShieldFlag(this);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.caster.getDead()) {
      this.destroy();
      return;
    }
    this.x = this.caster.x;
    this.y = this.caster.y;
  }

  public cast(): void {}

  public applyEffect(target: Character): void {
    if (target instanceof Player) return;
    target.takeDamage(this.causeDamage());
  }

  public destroy(fromScene?: boolean | undefined): void {
    this.caster.setLightningShieldFlag(this, true);
    this.audio?.stop();
    this.audioKeys.action = undefined;
    super.destroy(fromScene);
  }

  public absorbDamage(amount: number): number {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    if (this.capacity >= amount) {
      this.capacity -= amount;

      if (this.audioKeys.impact) {
        ServiceLocator.resolve(ServiceKeys.audio).play(this.audioKeys.impact);
      }

      return 0;
    }

    const remainingDamage = amount - this.capacity;
    this.capacity = 0;

    this.scene.events.emit('lightning-shield-expired');
    this.audioKeys.impact = undefined;
    this.destroy();

    return remainingDamage;
  }
}
