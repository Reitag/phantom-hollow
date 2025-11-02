import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UI } from '@/constants/asset-keys';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { Spell, SpellConfig } from '@/base/objects/spell';

export class DreadAura extends Spell {
  private range: number;
  private ui: UiSystem;

  constructor({ scene, position, keyName, caster, damage }: SpellConfig, range: number) {
    super({
      scene,
      position,
      keyName,
      caster,
      damage,
    });
    const { x, y } = position;
    this.range = range;
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.setPosition(x, y);
    this.arcadeBody.setAllowGravity(false);
    this.setVisible(false);
  }

  public cast(): void {
    const y = this.caster.getBottomCenter();
    this.x = this.caster.x;
    this.y = y.y;
  }

  public update(target: Character, delta: number): void {
    this.cast();

    if (!target || target.getDead()) {
      this.removeDebuffIcon(target);
      return;
    }

    const distanceX = target.x - this.x;
    const distanceY = target.y - this.y;

    if (Math.abs(distanceX) <= this.range && Math.abs(distanceY) <= this.range && this.damage) {
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
