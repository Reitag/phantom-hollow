import { InventoryIconContainer } from '@/components/ui/inventory-icons/inventory-icon-container';
import { ModifierIconContainer } from '@/components/ui/modifier-icons/modifier-icon-container';
import { CooldownAnimator } from '@/components/ui/spell-icons/cooldown-animator';
import { HealthBar } from '@/components/ui/healthbar/health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { IconHighlighter } from '@/components/ui/spell-icons/icon-highlighter';
import { Coins } from '@/components/ui/coins/coins';
import { Text } from '@/components/ui/text/text';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { ModifierType, Position, InventorySlot } from '@/utils/types';

export class UiSystem {
  healthBar: HealthBar;
  healthBarAnimator: HealthBarAnimator;

  castBar: CastBar;
  castBarAnimator: CastBarAnimator;

  cooldownAnimator: CooldownAnimator;
  iconHighlighter: IconHighlighter;

  inventoryIconContainer: InventoryIconContainer;
  modifierIconContainer: ModifierIconContainer;

  coins: Coins;

  text: Text;

  constructor(uiScene: Phaser.Scene) {
    this.healthBar = new HealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.cooldownAnimator = new CooldownAnimator(uiScene);
    this.iconHighlighter = new IconHighlighter(uiScene);

    this.inventoryIconContainer = new InventoryIconContainer(uiScene);
    this.modifierIconContainer = new ModifierIconContainer(uiScene);

    this.coins = new Coins(uiScene);

    this.text = new Text(uiScene);
  }

  public reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    this.healthBarAnimator.reducePlayerHealth(currentHealth, maxHealth);
  }

  public startCast(duration: number, onComplete: () => void): void {
    this.castBarAnimator.startCast(duration, onComplete);
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

  public addWarningtext(text: string): void {
    this.text.addWarningTextOnScreen(text);
  }
}
