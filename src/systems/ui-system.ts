import { Character } from '@/base/objects/character';
import { Dialog } from '@/components/ui/dialog/dialog';
import { ModifierIconContainer } from '@/components/ui/modifier-icons/modifier-icon-container';
import { HealthBar } from '@/components/ui/healthbar/health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { Coins } from '@/components/ui/coins/coins';
import { Store } from '@/components/ui/boards/store';
import { Text } from '@/components/ui/text/text';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { PanelService } from '@/infrastructure/panel-service';
import { ModifierType, TooltipFrameConfig, TooltipContentConfig } from '@/utils/types';
import { Quest } from '@/components/ui/boards/quest';

export class UiSystem {
  private healthBar: HealthBar;
  private healthBarAnimator: HealthBarAnimator;

  private castBar: CastBar;
  private castBarAnimator: CastBarAnimator;

  private modifierIconContainer: ModifierIconContainer;

  private store: Store;
  private quest: Quest;

  private coins: Coins;
  private text: Text;

  constructor(private uiScene: Phaser.Scene) {
    this.healthBar = new HealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.modifierIconContainer = new ModifierIconContainer(uiScene);

    this.store = new Store(uiScene);
    this.quest = new Quest(uiScene);

    this.coins = new Coins(uiScene);
    this.text = new Text(uiScene);

    ServiceLocator.register(ServiceKeys.panel, new PanelService(uiScene));
  }

  public reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    this.healthBarAnimator.reducePlayerHealth(currentHealth, maxHealth);
  }

  public restorePlayerHealth(): void {
    this.healthBar.setMask();
  }

  public startCast(duration: number): void {
    this.castBarAnimator.startCast(duration);
  }

  public stopCast(): void {
    this.castBarAnimator.stopCast();
  }

  public addModifierIcon(key: string, duration: number | undefined, type: ModifierType): void {
    this.modifierIconContainer.addModifierIcon(key, duration, type);

    if (duration) {
      this.modifierIconContainer.startCountdown(key, duration);
    }
  }

  public removeModifierIcon(key: string): void {
    this.modifierIconContainer.removeModifierIcon(key);
  }

  public removeAllModfierIcons(): void {
    this.modifierIconContainer.removeAllModifierIcons();
  }

  public getStore(): Store {
    return this.store;
  }

  public getQuest(): Quest {
    return this.quest;
  }

  public increaseCoinCounter(amount: number): void {
    this.coins.increaseCoins(amount);
  }

  public decreaseCoinCounter(amount: number): void {
    this.coins.decreaseCoins(amount);
  }

  public addWarningDialog(text: string): Dialog {
    const dialog = new Dialog(this.uiScene);
    dialog.setWarningDialog(text);
    return dialog;
  }

  public addWarningtext(text: string): void {
    this.text.addWarningTextOnScreen(text);
  }

  public showVerticalTooltip(frame: TooltipFrameConfig, content: TooltipContentConfig): void {
    this.text.addVerticalTooltip(frame, content);
  }

  public showHorizontalTooltip(frame: TooltipFrameConfig, content: TooltipContentConfig): void {
    this.text.addHorizontalTooltip(frame, content);
  }

  public hideTooltip(): void {
    this.text.removeTooltip();
  }

  public showDamageDealt(amount: number | string, target: Character): void {
    this.text.addDamageDisplayOnScreen(amount, target);
  }
}
