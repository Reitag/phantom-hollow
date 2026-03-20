import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { LIGHTNING_SHIELD } from '@/constants/modifier-stats';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { ModifierSystem } from '@/systems/modifier-system';

export class LightningShield extends Spell {
  private capacity: number;
  private modifier: ModifierSystem;

  constructor({ scene, position, keyName, frame, caster, spellPower, damage }: SpellConfig) {
    super({ scene, position, keyName, frame, caster, spellPower, damage });
    this.capacity = LIGHTNING_SHIELD.damage_absorb;
    this.modifier = this.caster.getModifier();
    this.anims.play(SPELLS_ANIMATION.LIGHTNING_SHIELD.MAIN);
    this.setSize(100, 100);

    scene.events.on('lightning-shield-damage', this.absorbDamage, this);
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
    this.scene.events.off('lightning-shield-damage', this.absorbDamage, this);
    super.destroy(fromScene);
  }

  private absorbDamage(amount: number): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.capacity -= amount;
    if (this.capacity > 0) {
      ui.showDamageDealt('Absorb', this.caster);
    } else {
      this.scene.events.emit('lightning-shield-expired');
    }
  }
}
