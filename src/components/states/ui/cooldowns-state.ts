import Phaser from 'phaser';

import { GLOBAL, BLINK } from '@/constants/spell-cooldowns';

export class CooldownsState {
  private activeCooldowns: Record<string, boolean> = {};

  constructor(private scene: Phaser.Scene) {}

  public isOnCooldown(key: string): boolean {
    return this.activeCooldowns[key];
  }

  public startGlobalCooldowns() {
    this.startCooldown(GLOBAL.NAME, GLOBAL.DURATION);
  }

  public startBlinkCooldown() {
    this.startCooldown(BLINK.NAME, BLINK.DURATION);
  }

  public startCooldown(key: string, delay: number): void {
    this.activeCooldowns[key] = true;
    this.scene.time.delayedCall(delay, () => {
      this.activeCooldowns[key] = false;
    });
  }
}
