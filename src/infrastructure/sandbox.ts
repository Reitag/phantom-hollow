import { AUDIO } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Player } from '@/entities/characters/player/player';
import { UiSystem } from '@/systems/ui-system';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { GLOBAL } from '@/constants/spell-cooldowns';
import { Position } from '@/utils/types';
import { PanelService } from './panel-service';

type PlayerPosition = Position & {
  direction: 1 | -1;
};

export class Sandbox {
  private cooldowns: SpellCooldowns;
  private ui: UiSystem;
  private panel: PanelService;

  constructor() {
    this.cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.panel = ServiceLocator.resolve(ServiceKeys.panel);
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
    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.HEALING);
    this.ui.reducePlayerHealth(stats.health!.current, stats.health!.max);
  }

  public startCooldown(spellKey: string, delay: number): void {
    this.cooldowns.startCooldown(spellKey, delay);
    this.startGlobalCooldown();
    this.panel.spellBar.startSpellIconCooldown(spellKey, delay);
    this.panel.spellBar.startGlobalSpellIconsCooldown(GLOBAL.DURATION);
  }

  public startGlobalCooldown(): void {
    this.cooldowns.startGlobalCooldowns();
    this.panel.spellBar.startGlobalSpellIconsCooldown(GLOBAL.DURATION);
  }

  public setText(text: string): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.addWarningtext(text);
  }

  private get player(): Player {
    return ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
  }
}
