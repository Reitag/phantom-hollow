import { Character } from '@/base/objects/character';
import { Dialog } from '@/components/ui/dialog/dialog';
import { InventoryIconContainer } from '@/components/ui/inventory-icons/inventory-icon-container';
import { ModifierIconContainer } from '@/components/ui/modifier-icons/modifier-icon-container';
import { CooldownAnimator } from '@/components/ui/spell-icons/cooldown-animator';
import { HealthBar } from '@/components/ui/healthbar/health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { IconHighlighter } from '@/components/ui/spell-icons/icon-highlighter';
import { Coins } from '@/components/ui/coins/coins';
import { Store } from '@/components/ui/store/store';
import { Text } from '@/components/ui/text/text';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import {
  ModifierType,
  Position,
  InventorySlot,
  TooltipFrameConfig,
  TooltipContentConfig,
} from '@/utils/types';

export class UiSystem {
  private healthBar: HealthBar;
  private healthBarAnimator: HealthBarAnimator;

  private castBar: CastBar;
  private castBarAnimator: CastBarAnimator;

  private cooldownAnimator: CooldownAnimator;
  private iconHighlighter: IconHighlighter;

  private inventoryIconContainer: InventoryIconContainer;
  private modifierIconContainer: ModifierIconContainer;

  private store!: Store;
  private coins: Coins;
  private text: Text;

  constructor(private uiScene: Phaser.Scene) {
    this.healthBar = new HealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.cooldownAnimator = new CooldownAnimator(uiScene);
    this.iconHighlighter = new IconHighlighter(uiScene);

    this.inventoryIconContainer = new InventoryIconContainer(uiScene);
    this.modifierIconContainer = new ModifierIconContainer(uiScene);

    this.store = new Store(uiScene);
    this.coins = new Coins(uiScene);
    this.text = new Text(uiScene);
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

  public startIconCooldown(coordinates: Position, duration: number): void {
    this.cooldownAnimator.startSingleCooldown(coordinates, duration);
  }

  public startGlobalIconsCooldown(duration: number): void {
    this.cooldownAnimator.startGlobalCooldown(duration);
  }

  public highlightSpell(spellKey: string): void {
    const key = spellKey as keyof typeof ICON_OVERLAYS;
    this.iconHighlighter.addSpellHighlight(key);
  }

  public removeHighlight(): void {
    this.iconHighlighter.removeSpellHighlight();
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

  public highlightSpot(index: number): void {
    this.iconHighlighter.addSlotHighlight(index);
  }

  public getStore(): Store {
    return this.store;
  }

  public updateInventory(items: (InventorySlot | null)[]): void {
    items.forEach((slot, index) => {
      if (slot) {
        this.inventoryIconContainer.setIcon(index, slot.item.iconKey, slot.quantity);
      } else {
        this.inventoryIconContainer.removeIcon(index);
      }
    });
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
