import { InventoryIconContainer } from '@/components/ui/inventory-icons/inventory-icon-container';
import { ModifierIconContainer } from '@/components/ui/modifier-icons/modifier-icon-container';
import { CooldownAnimator } from '@/components/ui/spell-icons/cooldown-animator';
import { HealthBar } from '@/components/ui/healthbar/health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { SpellIconHighlighter } from '@/components/ui/spell-icons/spell-icon-highlighter';
import { ICON_OVERLAYS } from '@/constants/ui-coordinates';
import { InventorySlot } from '@/items/core/item';
import { Position } from '@/utils/types';

export class UiManager {
  healthBar: HealthBar;
  healthBarAnimator: HealthBarAnimator;

  castBar: CastBar;
  castBarAnimator: CastBarAnimator;

  cooldownAnimator: CooldownAnimator;
  spellIconHighlighter: SpellIconHighlighter;

  inventoryIconContainer: InventoryIconContainer;
  modifierIconContainer: ModifierIconContainer;

  constructor(uiScene: Phaser.Scene) {
    this.healthBar = new HealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.cooldownAnimator = new CooldownAnimator(uiScene);
    this.spellIconHighlighter = new SpellIconHighlighter(uiScene);

    this.inventoryIconContainer = new InventoryIconContainer(uiScene);
    this.modifierIconContainer = new ModifierIconContainer(uiScene);
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
    this.spellIconHighlighter.addHighlight(key);
  }

  public removeHighlight(): void {
    this.spellIconHighlighter.removeHighlight();
  }

  public setDebuffIcon(key: string, duration: number | undefined): void {
    this.modifierIconContainer.addModifierIcon(key, duration);

    if (duration) {
      this.modifierIconContainer.startCountdown(key, duration);
    }
  }

  public removeDebuffIcon(key: string): void {
    this.modifierIconContainer.removeModifierIcon(key);
  }

  public removeAllModfierIcons(): void {
    this.modifierIconContainer.removeAllModifierIcons();
  }

  public updateInventory(items: (InventorySlot | null)[]): void {
    items.forEach((slot, index) => {
      if (slot) {
        // If icon already exists → just update quantity
        this.inventoryIconContainer.setIcon(index, slot.item.iconKey, slot.quantity);
      } else {
        // Empty slot → remove icon if it exists
        this.inventoryIconContainer.removeIcon(index);
      }
    });
  }
}
