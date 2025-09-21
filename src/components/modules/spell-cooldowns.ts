import Phaser from 'phaser';

import { GLOBAL } from '@/constants/spell-cooldowns';

export class SpellCooldowns {
  private activeCooldowns: Record<string, boolean> = {};

  constructor(private scene: Phaser.Scene) {}

  public isOnCooldown(key: string): boolean {
    return this.activeCooldowns[key];
  }

  public startGlobalCooldowns() {
    this.startCooldown(GLOBAL.NAME, GLOBAL.DURATION);
  }

  public startCooldown(key: string, delay: number): void {
    this.activeCooldowns[key] = true;
    this.scene.time.delayedCall(delay, () => {
      this.activeCooldowns[key] = false;
    });
  }
}
