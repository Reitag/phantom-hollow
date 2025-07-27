import { CooldownAnimator } from '@/components/ui/spell-icons/cooldown-animator';
import { HealthBar } from '@/components/ui/healthbar/health-bar';
import { HealthBarAnimator } from '@/components/ui/healthbar/health-bar-animator';
import { CastBar } from '@/components/ui/castbar/cast-bar';
import { CastBarAnimator } from '@/components/ui/castbar/cast-bar-animator';
import { SpellIconHighlighter } from '@/components/ui/spell-icons/spell-icon-highlighter';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { Position } from '@/utils/types';

export class UiManager {
  healthBar: HealthBar;
  healthBarAnimator: HealthBarAnimator;

  castBar: CastBar;
  castBarAnimator: CastBarAnimator;

  cooldownAnimator: CooldownAnimator;
  spellIconHighlighter: SpellIconHighlighter;

  constructor(uiScene: Phaser.Scene) {
    this.healthBar = new HealthBar(uiScene);
    this.healthBarAnimator = new HealthBarAnimator(this.healthBar);

    this.castBar = new CastBar(uiScene);
    this.castBarAnimator = new CastBarAnimator(uiScene, this.castBar);

    this.cooldownAnimator = new CooldownAnimator(uiScene);
    this.spellIconHighlighter = new SpellIconHighlighter(uiScene);
  }

  reducePlayerHealth(currentHealth: number, maxHealth: number): void {
    this.healthBarAnimator.reducePlayerHealth(currentHealth, maxHealth);
  }

  startCast(duration: number, onComplete: () => void): void {
    this.castBarAnimator.startCast(duration, onComplete);
  }

  stopCast(): void {
    this.castBarAnimator.stopCast();
  }

  setCooldownsToCooldownAnimator(cooldowns: CooldownsState): void {
    this.cooldownAnimator.setCooldownsState(cooldowns);
  }

  startIconCooldown(coordinates: Position, duration: number): void {
    this.cooldownAnimator.startSingleCooldown(coordinates, duration);
  }

  startGlobalIconsCooldown(duration: number): void {
    this.cooldownAnimator.startGlobalCooldown(duration);
  }

  highlightSpell(spellKey: string): void {
    this.spellIconHighlighter.addHighlight(spellKey);
  }

  removeHighlight(): void {
    this.spellIconHighlighter.removeHighlight();
  }
}
