import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UI } from '@/constants/asset-keys';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { Spell, SpellConfig } from '@/base/objects/spell';

export class DreadAura extends Spell {
  private aura: Phaser.GameObjects.Arc;
  private tween: Phaser.Tweens.Tween;
  private range: number;
  private ui: UiSystem;

  constructor({ scene, position, keyName, caster, damage }: SpellConfig, range: number) {
    super({
      scene,
      position,
      keyName,
      caster,
      damage,
    });
    const { x, y } = position;
    this.range = range;
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.setPosition(x, y);
    this.arcadeBody.setAllowGravity(false);
    this.setVisible(false);

    // aura effect
    this.aura = scene.add.circle(x, y, this.range, 0x2a003f, 0.25);
    this.aura.setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.aura.setDepth(65);

    // invisible
    this.aura.setAlpha(0);

    this.tween = scene.tweens.add({
      targets: this.aura,
      scale: 0.95,
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tween = scene.tweens.add({
          targets: this.aura,
          scale: { from: 0.95, to: 1.05 },
          alpha: 1,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });
  }

  public cast(): void {
    const y = this.caster.getBottomCenter();
    this.x = this.caster.x;
    this.y = y.y;

    this.aura.setPosition(this.x, this.y);
  }

  public applyEffect(target: Character): void {}

  public update(target: Character, delta: number): void {
    this.cast();

    if (!target || target.getDead()) {
      this.removeDebuffIcon(target);
      return;
    }

    const distanceX = target.x - this.x;
    const distanceY = target.y - this.y;

    if (Math.abs(distanceX) <= this.range && Math.abs(distanceY) <= this.range && this.damage) {
      target.takeDamage(this.causeDamage() * (delta / 1000));
      target.setTint(0x9966ff);
      this.setDebuffIcon(target);
    } else if (this.ui.checkModifierIcon(UI.DREAD_AURA_DEBUFF)) {
      this.removeDebuffIcon(target);
      target.clearTint();
    }
  }

  public destroy(fromScene?: boolean): void {
    this.ui.removeModifierIcon(UI.DREAD_AURA_DEBUFF);

    this.scene.tweens.add({
      targets: this.aura,
      scale: 1.15,
      alpha: 0,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.aura.destroy();
        this.tween.destroy();
        super.destroy(fromScene);
      },
    });
  }

  private setDebuffIcon(target: Character): void {
    if (target instanceof Player) {
      this.ui.addModifierIcon(UI.DREAD_AURA_DEBUFF, undefined, 'debuff');
    }
  }

  private removeDebuffIcon(target: Character): void {
    if (target instanceof Player) {
      this.ui.removeModifierIcon(UI.DREAD_AURA_DEBUFF);
    }
  }
}
