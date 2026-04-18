import { BossHealthBar } from './boss-health-bar';
import { PlayerHealthBar } from './player-health-bar';

export class HealthBarAnimator {
  constructor(private healthBar: PlayerHealthBar | BossHealthBar) {}

  public reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    const percentage = this.clamp(currentHealth / maxHealth, 0, 1);
    const { x, y, width, height } = this.healthBar.bar;

    const mask = this.healthBar.getMask();
    if (!mask) return;

    mask.clear();
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(x, y, width * percentage, height, 1);
  }

  public reduceBossHealth(currentHealth: number, maxHealth: number): void {
    const percentage = this.clamp(currentHealth / maxHealth, 0, 1);
    const { x, y, width, height } = this.healthBar.bar;

    const mask = this.healthBar.getMask();
    if (!mask) return;

    const visibleWidth = width * percentage;
    const offsetX = x + (width - visibleWidth);

    mask.clear();
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(offsetX, y, visibleWidth, height, 1);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
