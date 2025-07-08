import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Blink } from '@/objects/spells/effect-spells/blink';
import { SPELLS } from '@/utils/constants';

export class SpellFactory {
  spellGroup: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    this.scene = scene;

    this.spellGroup = this.scene.physics.add.group({
      runChildUpdate: true,
      allowGravity: false,
    });
  }

  createFireball(x: number, y: number, direction: number): void {
    const offsetX = direction * 20;

    const fireBall = new FireBall({
      scene: this.scene,
      position: { x: x + offsetX, y: y },
      keyName: SPELLS.FIREBALL,
      frame: 0,
      direction: direction,
    });

    this.spellGroup.add(fireBall, true);
  }

  createBlink(x: number, y: number, direction: number): void {
    const blink = new Blink({
      scene: this.scene,
      position: { x: x - 4 * direction, y: y + 5 },
      keyName: SPELLS.BLINK,
      frame: 0,
    });
  }

  getSpells(): Phaser.Physics.Arcade.Group {
    return this.spellGroup;
  }
}
