import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Blink } from '@/objects/spells/effect-spells/blink';
import { SPELLS as SPELL_ASSET } from '@/constants/asset-keys';
import { SPELLS as SPELL_ANIM } from '@/constants/animation-keys';
import { FIRE_BALL_HIT } from '@/constants/object-stats';

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
      keyName: SPELL_ASSET.FIRE_BALL,
      frame: 0,
      sandbox,
      animation: {
        main: SPELL_ANIM.FIRE_BALL.MAIN,
        destroy: SPELL_ANIM.FIRE_BALL.DESTROY,
      },
      damage: FIRE_BALL_HIT,
      speed: 300,
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
      keyName: SPELL_ASSET.BLINK,
      frame: 0,
      sandbox,
      animation: {
        main: SPELL_ANIM.BLINK.MAIN,
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
