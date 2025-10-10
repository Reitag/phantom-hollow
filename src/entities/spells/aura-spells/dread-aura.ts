import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UI } from '@/constants/asset-keys';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/entites/character';
import { Player } from '@/entities/characters/player/player';
import { Spell, SpellConfig } from '@/base/entites/spell';

export class DreadAura extends Spell {
  private range: number;
  private ui: UiSystem;

  constructor({ scene, position, keyName, damage }: SpellConfig, range: number) {
    super({
      scene,
      position,
      keyName,
      damage,
    });
    const { x, y } = position;
    this.range = range;
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.setPosition(x, y);
  }

  public cast(): void {}

  public update(target: Character, delta: number): void {
    if (!target || target.getDead()) {
      this.removeDebuffIcon(target);
      return;
    }

    const distance = target.x - this.x;

    if (Math.abs(distance) <= this.range && this.damage) {
      target.takeAuraDamage(this.causeDamage() * (delta / 1000));
      this.setDebuffIcon(target);
    } else {
      this.removeDebuffIcon(target);
    }
  }

  private setDebuffIcon(target: Character): void {
    if (target instanceof Player) {
      this.ui.addModifierIcon(UI.DREAD_AURA_DEBUFF, undefined, 'debuff');
    }
  }

  private removeDebuffIcon(target: Character): void {
    if (target instanceof Player) {
      this.ui.removeModifierIcon(UI.DREAD_AURA_DEBUFF);
    }
  }
}
