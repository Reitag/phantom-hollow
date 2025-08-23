import { HEALTH_BAR } from '@/constants/ui-coordinates';
import { HealthBar } from './health-bar';

export class HealthBarAnimator {
  private healthBar: HealthBar;

  constructor(healthBar: HealthBar) {
    this.healthBar = healthBar;
  }

  reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    const percentage = this.clamp(currentHealth / maxHealth, 0, 1);
    const { X, Y, WIDTH, HEIGHT } = HEALTH_BAR;

    const mask = this.healthBar.getMask();
    if (!mask) return;

    mask.clear();
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(X, Y - HEIGHT / 2, WIDTH * percentage, HEIGHT, 1);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
