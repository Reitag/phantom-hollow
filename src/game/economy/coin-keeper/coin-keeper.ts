import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiSystem } from '@/systems/ui-system';

export class CoinKeeper {
  private balance = 0;
  private ui: UiSystem;

  constructor() {
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
  }

  public get coins(): number {
    return this.balance;
  }

  public addCoins(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      this.ui.increaseCoinCounter(amount);
    }
  }

  public removeCoins(amount: number): boolean {
    if (amount > this.balance) {
      this.ui.addWarningtext('Not enough coins');
      return false;
    } else {
      this.balance -= amount;
      this.ui.decreaseCoinCounter(amount);
      return true;
    }
  }
}
