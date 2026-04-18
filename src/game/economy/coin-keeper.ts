import { AUDIO } from '@/constants/asset-keys';
import { SaveService } from '@/infrastructure/save-service';
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

  public addCoins(amount: number, saveToData = true): void {
    if (amount > 0) {
      this.balance += amount;
      this.ui.increaseCoinCounter(amount);

      if (saveToData) {
        this.saveBalanceData();
      }
    }
  }

  public removeCoins(amount: number): boolean {
    if (amount > this.balance) {
      this.ui.addWarningtext('Not enough coins');
      return false;
    } else {
      this.balance -= amount;
      this.ui.decreaseCoinCounter(amount);

      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.COIN_BUY);

      this.saveBalanceData();
      return true;
    }
  }

  private saveBalanceData(): void {
    SaveService.patch({
      coins: this.balance,
    });
  }
}
