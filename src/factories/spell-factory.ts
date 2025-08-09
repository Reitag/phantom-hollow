import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Blink } from '@/objects/spells/effect-spells/blink';
import { SPELLS } from '@/utils/constants';
import { AnimationKeys } from '@/utils/animation-keys';

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
      keyName: SPELLS.FIREBALL,
      frame: 0,
      sandbox,
      animation: {
        main: AnimationKeys.Spells.Fireball.Main,
        destroy: AnimationKeys.Spells.Fireball.Destroy,
      },
      damage: 120,
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
      keyName: SPELLS.BLINK,
      frame: 0,
      sandbox,
      animation: {
        main: AnimationKeys.Spells.Blink.Main,
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
