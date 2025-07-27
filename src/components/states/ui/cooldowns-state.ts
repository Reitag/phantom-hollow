import Phaser from 'phaser';

import { SPELLS, SPELLS_COOLDOWNS } from '@/utils/constants';

export class CooldownsState {
  private activeCooldowns: Record<string, boolean> = {};

  constructor(private scene: Phaser.Scene) {}

  isOnCooldown(key: string): boolean {
    return this.activeCooldowns[key];
  }

  startGlobalCooldowns() {
    this.startCooldown(SPELLS.GLOBAL, SPELLS_COOLDOWNS.GLOBAL);
  }

  startBlinkCooldown() {
    this.startCooldown(SPELLS.BLINK, SPELLS_COOLDOWNS.BLINK);
  }

  private startCooldown(key: string, delay: number): void {
    this.activeCooldowns[key] = true;
    this.scene.time.delayedCall(delay, () => {
      this.activeCooldowns[key] = false;
    });
  }
}
