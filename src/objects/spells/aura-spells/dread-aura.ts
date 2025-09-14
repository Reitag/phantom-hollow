import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { UI } from '@/constants/asset-keys';
import { UiManager } from '@/managers/ui-manager';
import { Character } from '@/objects/core/character';
import { Player } from '@/objects/characters/player/player';
import { Spell, SpellConfig } from '@/objects/core/spell';

export class DreadAura extends Spell {
  private range: number;
  private ui: UiManager;

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
      this.ui.setDebuffIcon(UI.DREAD_AURA_DEBUFF, undefined);
    }
  }

  private removeDebuffIcon(target: Character): void {
    if (target instanceof Player) {
      this.ui.removeDebuffIcon(UI.DREAD_AURA_DEBUFF);
    }
  }
}
