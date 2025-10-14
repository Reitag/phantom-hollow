import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Player } from '@/entities/characters/player/player';
import { UiSystem } from '@/systems/ui-system';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { GLOBAL } from '@/constants/spell-cooldowns';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { Position } from '@/utils/types';

type PlayerPosition = Position & {
  direction: 1 | -1;
};

export class Sandbox {
  private cooldowns: SpellCooldowns;
  private ui: UiSystem;

  constructor() {
    this.cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public getPlayerPosition(): PlayerPosition {
    return { x: this.player.x, y: this.player.y, direction: this.player.getFacingRight() ? 1 : -1 };
  }

  public destroySpell(spell: Phaser.GameObjects.GameObject): void {
    spell.destroy();
  }

  public healPlayer(amount: number): void {
    const stats = this.player.getStats();
    stats.health?.heal(amount);
    this.ui.reducePlayerHealth(stats.health!.current, stats.health!.max);
  }

  public startCooldown(spellKey: string, delay: number): void {
    this.cooldowns.startCooldown(spellKey, delay);
    this.startGlobalCooldown();

    const key = spellKey as keyof typeof ICON_OVERLAYS;
    const icon = ICON_OVERLAYS[key];
    if (icon) {
      this.ui.startIconCooldown({ x: icon.X, y: icon.Y }, delay);
    }
    this.ui.startGlobalIconsCooldown(GLOBAL.DURATION);
  }

  public startGlobalCooldown(): void {
    this.cooldowns.startGlobalCooldowns();
    this.ui.startGlobalIconsCooldown(GLOBAL.DURATION);
  }

  public setText(text: string): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.addWarningtext(text);
  }

  private get player(): Player {
    return ServiceLocator.resolve(ServiceKeys.player);
  }
}
