import { Character } from '@/base/objects/character';
import { Dialog } from '@/components/ui/dialog/dialog';
import { ModifierIconContainer } from '@/components/ui/modifier-icons/modifier-icon-container';
import { PlayerHealthBar } from '@/components/ui/healthbar/player-health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { BossHealthBar } from '@/components/ui/healthbar/boss-health-bar';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { Coins } from '@/components/ui/coins/coins';
import { Store } from '@/components/ui/boards/store';
import { Text } from '@/components/ui/text/text';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { PanelService } from '@/infrastructure/panel-service';
import { ModifierType, TooltipFrameConfig, TooltipContentConfig } from '@/utils/types';
import { Quest } from '@/components/ui/boards/quest';
import { Letter } from '@/components/ui/boards/letter';

export class UiSystem {
  private healthBar: PlayerHealthBar;
  private healthBarAnimator: HealthBarAnimator;

  private bossHealths: Record<
    string,
    {
      bossHealthBar: BossHealthBar;
      healthAnimator: HealthBarAnimator;
    }
  > = {};

  private castBar: CastBar;
  private castBarAnimator: CastBarAnimator;

  private modifierIconContainer: ModifierIconContainer;

  private uiBoards = new Map<string, unknown>();

  //private store: Store;
  //private quest: Quest;

  private coins: Coins;
  private text: Text;

  constructor(private uiScene: Phaser.Scene) {
    this.healthBar = new PlayerHealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.createBossHealth('fireworm', 'Blazeworm');
    this.createBossHealth('evil-wizard', 'Sacryth, the Duskbringer');

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.modifierIconContainer = new ModifierIconContainer(uiScene);

    this.uiBoards.set('store', new Store(uiScene));
    this.uiBoards.set('quest', new Quest(uiScene));
    this.uiBoards.set('letter', new Letter(uiScene));

    //this.store = new Store(uiScene);
    //this.quest = new Quest(uiScene);

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

  public showBossHealthBar(key: string): void {
    this.hideBossHealthBar();
    this.bossHealths[key].bossHealthBar.show();
  }

  public hideBossHealthBar(): void {
    Object.values(this.bossHealths).forEach((b) => b.bossHealthBar.hide());
  }

  public reduceBossHealth(key: string, currentHealth: number, maxHealth: number): void {
    this.bossHealths[key].healthAnimator.reduceBossHealth(currentHealth, maxHealth);
  }

  public restoreBossesHealth(): void {
    Object.values(this.bossHealths).forEach((b) => b.bossHealthBar.setMask());
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

  public checkModifierIcon(key: string): boolean {
    if (this.modifierIconContainer.findModifierIcon(key)) {
      return true;
    }
    return false;
  }

  public removeModifierIcon(key: string): void {
    this.modifierIconContainer.removeModifierIcon(key);
  }

  public removeAllModfierIcons(): void {
    this.modifierIconContainer.removeAllModifierIcons();
  }

  public getBoard<T>(key: string): T {
    return this.uiBoards.get(key) as T;
  }

  /*public getStore(): Store {
    return this.store;
  }

  public getQuest(): Quest {
    return this.quest;
  }*/

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

  public showDamageDealt(amount: number | string, target: Character, isCritical = false): void {
    this.text.addDamageDisplayOnScreen(amount, target, isCritical);
  }

  private createBossHealth(key: string, bossName: string) {
    const bar = new BossHealthBar(this.uiScene, bossName);
    const animator = new HealthBarAnimator(bar);

    this.bossHealths[key] = {
      bossHealthBar: bar,
      healthAnimator: animator,
    };
  }
}
