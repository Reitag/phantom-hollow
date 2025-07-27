import { Player } from '@/objects/characters/player/player';
import { SpellFactory } from '@/factories/spell-factory';
import { UiManager } from '@/managers/ui-manager';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { SPELLS, SPELLS_COOLDOWNS } from '@/utils/constants';
import { blinkIcon } from '@/utils/coordinates';

export class SpellManager {
  private cooldowns: CooldownsState;
  private player!: Player;

  constructor(
    private scene: Phaser.Scene,
    private spellFactory: SpellFactory,
    private ui: UiManager
  ) {
    this.cooldowns = new CooldownsState(scene);
    ui.setCooldownsToCooldownAnimator(this.cooldowns);
  }

  setPlayer(player: Player): void {
    this.player = player;
  }

  canCast(spellKey: string): boolean {
    return !this.cooldowns.isOnCooldown(spellKey) && !this.cooldowns.isOnCooldown(SPELLS.GLOBAL);
  }

  castFireball(): void {
    const [x, y, direction] = this.getPlayerStats();

    this.spellFactory.createFireball(x, y, direction);

    this.cooldowns.startGlobalCooldowns();
    this.ui.startGlobalIconsCooldown(SPELLS_COOLDOWNS.GLOBAL);
  }

  castBlink(): void {
    const distance = 300;
    const blinkDelay = 500;
    const [x, y, direction] = this.getPlayerStats();

    this.player.hide();
    this.spellFactory.createBlink(x, y, direction);

    this.cooldowns.startBlinkCooldown();
    this.cooldowns.startGlobalCooldowns();

    this.ui.startIconCooldown(blinkIcon, SPELLS_COOLDOWNS.BLINK);
    this.ui.startGlobalIconsCooldown(SPELLS_COOLDOWNS.GLOBAL);

    this.scene.time.delayedCall(blinkDelay, () => {
      this.player.teleportTo(distance, direction);
      this.player.show();
    });
  }

  private getPlayerStats(): number[] {
    const { x, y } = this.player;
    const direction = this.player.getFacingRight() ? 1 : -1;

    return [x, y, direction];
  }
}
