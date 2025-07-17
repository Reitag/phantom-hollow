import { healthBar } from '@/utils/coordinates';
import { HealthBar } from './health-bar';

export class HealthBarAnimator {
  private healthBar: HealthBar;

  constructor(healthBar: HealthBar) {
    this.healthBar = healthBar;
  }

  reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    const percentage = this.clamp(currentHealth / maxHealth, 0, 1);
    const { x, y, width, height } = healthBar;

    const mask = this.healthBar.getMask();
    if (!mask) return;

    mask.clear();
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(x, y - height / 2, width * percentage, height, height / 2);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
