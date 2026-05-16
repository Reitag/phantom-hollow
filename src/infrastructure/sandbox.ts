import { AUDIO } from '@/constants/asset-keys';
import { GLOBAL } from '@/constants/spell-cooldowns';
import { FIRE_ACCUM, FIRE_CRIT } from '@/constants/modifier-stats';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Player } from '@/entities/characters/player/player';
import { UiSystem } from '@/systems/ui-system';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { Position } from '@/utils/types';
import { PanelService } from './panel-service';

type PlayerPosition = Position & {
  direction: 1 | -1;
};

export class Sandbox {
  private fireAccumStacks: number = 0;

  private main: Player | null = null;
  private cooldowns: SpellCooldowns;
  private ui: UiSystem;
  private panel: PanelService;

  constructor() {
    this.cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.panel = ServiceLocator.resolve(ServiceKeys.panel);
  }

  public resetFireStacks() {
    this.fireAccumStacks = 0;
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

  public findSomeRelic(): string | undefined {
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const relics = [LOOT_FACTORY['fire-relic'], LOOT_FACTORY['frost-relic']];

    const relic = relics.find((elem) => inventory.getItemIndex(elem().id) !== undefined);

    return relic ? relic().id : undefined;
  }

  // Fire relic
  public trackFireRelicHit(): void {
    this.fireAccumStacks++;
    if (this.fireAccumStacks > 3) {
      this.resetFireStacks();
      return;
    }

    if (this.fireAccumStacks === 3) {
      this.applyCriticalBuff();
    } else {
      this.applyStandardBuff();
    }
  }

  private applyStandardBuff(): void {
    this.ui.addModifierIcon(FIRE_ACCUM.id, undefined, FIRE_ACCUM.type);
  }

  private applyCriticalBuff(): void {
    this.ui.removeModifierIcon(FIRE_ACCUM.id);

    const modifier = this.player.getModifier();
    modifier.addModifier(FIRE_CRIT.id);
    modifier.startModifier(FIRE_CRIT.id, this.player);
  }

  public setText(text: string): void {
    this.ui.addWarningtext(text);
  }

  private get player(): Player {
    if (!this.main) {
      this.main = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    }

    return this.main;
  }
}
