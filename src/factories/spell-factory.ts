import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Blink } from '@/objects/spells/effect-spells/blink';
import { SPELLS } from '@/constants/asset-keys';
import { SPELLS_ANIMATION } from '@/constants/animation-keys';
import { FIRE_BALL_STATS } from '@/constants/object-stats';

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
    const offsetX = direction * 20;

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

  public getSpells(): Phaser.Physics.Arcade.Group {
    return this.spellGroup;
  }
}
