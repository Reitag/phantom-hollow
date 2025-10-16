import { Character } from '@/base/objects/character';
import { SpellPower } from '@/components/stats/damage';
import { FireBall } from '@/entities/spells/direct-spells/fire-ball';
import { Blink } from '@/entities/spells/effect-spells/blink';
import { Wind } from '@/entities/spells/direct-spells/wind';
import { ShadowBolt } from '@/entities/spells/direct-spells/shadow-bolt';
import { SPELLS } from '@/constants/asset-keys';
import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { FIRE_BALL_STATS, WIND_STATS, SHADOW_BOLT_STATS } from '@/constants/object-stats';

export class SpellFactory {
  private spellGroup: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    this.spellGroup = this.scene.physics.add.group({
      runChildUpdate: true,
      allowGravity: false,
    });
  }

  public createFireball(character: Character): FireBall {
    const position = this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const fireBall = new FireBall({
      scene: this.scene,
      position: position,
      keyName: SPELLS.FIRE_BALL,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      animation: {
        main: SPELLS_ANIMATION.FIRE_BALL.MAIN,
        destroy: SPELLS_ANIMATION.FIRE_BALL.DESTROY,
      },
      damage: FIRE_BALL_STATS.HIT,
      speed: FIRE_BALL_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(fireBall, true);

    return fireBall;
  }

  public createBlink(character: Character): Blink {
    const position = character.getPosition();
    const direction = character.getFacingRight() ? 1 : -1;

    const blink = new Blink({
      scene: this.scene,
      position: position,
      keyName: SPELLS.BLINK,
      frame: 0,
      caster: character,
      animation: {
        main: SPELLS_ANIMATION.BLINK.MAIN,
      },
      direction: direction,
    });

    this.spellGroup.add(blink, true);

    return blink;
  }

  public createWind(character: Character): Wind {
    const position = this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;

    const wind = new Wind({
      scene: this.scene,
      position: position,
      keyName: SPELLS.WIND,
      frame: 0,
      caster: character,
      animation: {
        main: SPELLS_ANIMATION.WIND.MAIN,
        destroy: SPELLS_ANIMATION.WIND.DESTROY,
      },
      speed: WIND_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(wind, true);

    return wind;
  }

  public createShadowBolt(character: Character): ShadowBolt {
    const position = this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const shadowBolt = new ShadowBolt({
      scene: this.scene,
      position: position,
      keyName: SPELLS.SHADOW_BOLT,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      animation: {
        main: SPELLS_ANIMATION.SHADOW_BOLT.MAIN,
        destroy: SPELLS_ANIMATION.SHADOW_BOLT.DESTROY,
      },
      damage: SHADOW_BOLT_STATS.HIT,
      speed: SHADOW_BOLT_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(shadowBolt, true);

    return shadowBolt;
  }

  public getSpells(): Phaser.Physics.Arcade.Group {
    return this.spellGroup;
  }

  private getSpellSpawnPosition(character: Character): { x: number; y: number } {
    const { x, y } = character.getPosition();
    const flip = character.getFacingRight() ? 1 : -1;

    const handOffsetX = 40 * flip;
    const handOffsetY = character.height / 8;

    return { x: x + handOffsetX, y: y + handOffsetY };
  }
}
