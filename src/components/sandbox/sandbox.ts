import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { Player } from '@/objects/characters/player/player';
import { UiManager } from '@/managers/ui-manager';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { SPELLS_COOLDOWNS } from '@/utils/constants';
import { blinkIcon } from '@/utils/coordinates';
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

    this.ui.startIconCooldown(blinkIcon, SPELLS_COOLDOWNS.BLINK);
    this.ui.startGlobalIconsCooldown(SPELLS_COOLDOWNS.GLOBAL);
  }

  public startGlobalCooldown(): void {
    this.cooldowns.startGlobalCooldowns();
    this.ui.startGlobalIconsCooldown(SPELLS_COOLDOWNS.GLOBAL);
  }

  private get player(): Player {
    return ServiceLocator.resolve(ServiceKeys.player);
  }
}
