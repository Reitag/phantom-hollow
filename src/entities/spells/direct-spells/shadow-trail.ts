import { Spell, SpellConfig } from '@/base/objects/spell';
import { Character } from '@/base/objects/character';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION, VFX_ANIMATION } from '@/constants/animation-keys';
import { SHADOW_TRAIL_STATS } from '@/constants/object-stats';

export class ShadowTrail extends Spell {
  private sizeX = 50;
  private sizeY = 50;

  constructor({
    scene,
    position,
    keyName,
    frame,
    caster,
    spellPower,
    damage,
    speed,
    direction,
  }: SpellConfig) {
    super({
      scene,
      position,
      keyName,
      frame,
      caster,
      spellPower,
      damage,
      speed,
      direction,
    });

    this.animations = {
      [SPELL_ANIMATION_KEYS.START]: SPELLS_ANIMATION.SHADOW_TRAIL.START,
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.SHADOW_TRAIL.MAIN,
      [SPELL_ANIMATION_KEYS.HIT]: SPELLS_ANIMATION.SHADOW_TRAIL.HIT,
    };

    this.arcadeBody.setSize(this.sizeX, this.sizeY);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.caster.getDead()) {
      this.destroy();
      return;
    }
  }

  public cast(): void {
    const offsetX = this.width / 2 + ((this.direction ?? 1) > 0 ? +60 : -100);
    const offsetY = this.height / 2 - 25;
    this.arcadeBody.setOffset(offsetX, offsetY);

    this.setSpellVelocity();
    this.playMainAnimation();

    this.scene.time.delayedCall(SHADOW_TRAIL_STATS.LIFE_TIME, () => {
      if (!this.active) return;
      this.destroySpell();
    });
  }

  public applyEffect(target: Character): void {
    target.takeDamage(this.causeDamage(), this.getCaster());
  }

  protected override onDestroyStart(): void {
    const casterX = (this.direction ?? 1) > 0 ? this.arcadeBody.right : this.arcadeBody.left;
    this.caster.setPosition(casterX, this.caster.y);
    this.emit('spellFinished');
  }
}
