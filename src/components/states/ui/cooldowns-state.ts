import Phaser from 'phaser';

import { SPELLS, SPELLS_COOLDOWNS } from '@/utils/constants';

export class CooldownsState {
  private activeCooldowns: Record<string, boolean> = {};

  constructor(private scene: Phaser.Scene) {}

  public isOnCooldown(key: string): boolean {
    return this.activeCooldowns[key];
  }

  public startGlobalCooldowns() {
    this.startCooldown(SPELLS.GLOBAL, SPELLS_COOLDOWNS.GLOBAL);
  }

  public startBlinkCooldown() {
    this.startCooldown(SPELLS.BLINK, SPELLS_COOLDOWNS.BLINK);
  }

  public startCooldown(key: string, delay: number): void {
    this.activeCooldowns[key] = true;
    this.scene.time.delayedCall(delay, () => {
      this.activeCooldowns[key] = false;
    });
  }
}
