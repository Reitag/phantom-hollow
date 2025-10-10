import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';

export class CoinKeeper {
  private coins = 0;
  private ui: UiSystem;

  constructor() {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public addCoins(amount: number): void {
    if (amount > 0) {
      this.coins += amount;
      this.ui.increaseCoinCounter(amount);
    }
  }

  public removeCoins(amount: number): void {
    if (amount >= this.coins) {
      this.coins = 0;
      this.ui.decreaseCoinCounter(this.coins);
    } else {
      this.coins -= amount;
      this.ui.decreaseCoinCounter(amount);
    }
  }
}
