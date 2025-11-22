import { Character } from '@/base/objects/character';
import { Spell, SpellConfig } from '@/base/objects/spell';
import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { Player } from '@/entities/characters/player/player';

export class LightningShield extends Spell {
  constructor({ scene, position, keyName, frame, caster, spellPower, damage }: SpellConfig) {
    super({ scene, position, keyName, frame, caster, spellPower, damage });
    this.anims.play(SPELLS_ANIMATION.LIGHTNING_SHIELD.MAIN);
    this.setSize(100, 100);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.caster.getDead()) {
      this.destroy();
      return;
    }
    this.x = this.caster.x;
    this.y = this.caster.y;
  }

  public cast(): void {}

  public applyEffect(target: Character): void {
    if (target instanceof Player) return;
    target.takeDamage(this.causeDamage());
  }
}
