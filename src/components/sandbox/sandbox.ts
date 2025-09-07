import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { Player } from '@/objects/characters/player/player';
import { UiManager } from '@/managers/ui-manager';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { GLOBAL } from '@/constants/spell-cooldowns';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { Position } from '@/utils/types';

type PlayerPosition = Position & {
  direction: 1 | -1;
};

export class Sandbox {
  private cooldowns: CooldownsState;
  private ui: UiManager;

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

  public teleportPlayer(distance: number, direction: number): void {
    this.player.teleportTo(distance, direction);
  }

  public hidePlayer(): void {
    this.player.hide();
  }

  public showPlayer(): void {
    this.player.show();
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

  private get player(): Player {
    return ServiceLocator.resolve(ServiceKeys.player);
  }
}
