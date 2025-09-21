import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Blink } from '@/objects/spells/effect-spells/blink';
import { Wind } from '@/objects/spells/direct-spells/wind';
import { ShadowBolt } from '@/objects/spells/direct-spells/shadow-bolt';
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

  public createFireball(x: number, y: number, direction: number): FireBall {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    const offsetX = direction * 31;

    const fireBall = new FireBall({
      scene: this.scene,
      position: { x: x + offsetX, y: y },
      keyName: SPELLS.FIRE_BALL,
      frame: 0,
      sandbox,
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

  public createBlink(x: number, y: number, direction: number): Blink {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);

    const blink = new Blink({
      scene: this.scene,
      position: { x: x - 4 * direction, y: y + 5 },
      keyName: SPELLS.BLINK,
      frame: 0,
      sandbox,
      animation: {
        main: SPELLS_ANIMATION.BLINK.MAIN,
      },
      direction: direction,
    });

    this.spellGroup.add(blink, true);

    return blink;
  }

  public createWind(x: number, y: number, direction: number): Wind {
    const sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    const offsetX = direction * 31;

    const wind = new Wind({
      scene: this.scene,
      position: { x: x + offsetX, y: y },
      keyName: SPELLS.WIND,
      frame: 0,
      sandbox,
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

  public createShadowBolt(x: number, y: number, direction: number): ShadowBolt {
    const shadowBolt = new ShadowBolt({
      scene: this.scene,
      position: { x: x, y: y },
      keyName: SPELLS.SHADOW_BOLT,
      frame: 0,
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
}
