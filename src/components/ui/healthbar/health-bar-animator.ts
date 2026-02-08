import { HealthBar } from './health-bar';

export class HealthBarAnimator {
  private healthBar: HealthBar;

  constructor(healthBar: HealthBar) {
    this.healthBar = healthBar;
  }

  public reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    const percentage = this.clamp(currentHealth / maxHealth, 0, 1);
    const { x, y, width, height } = this.healthBar.bar;

    const mask = this.healthBar.getMask();
    if (!mask) return;

    mask.clear();
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(x, y, width * percentage, height, 1);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
