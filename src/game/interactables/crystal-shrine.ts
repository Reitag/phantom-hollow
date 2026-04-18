import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Health } from '@/components/stats/health';
import { MISC, UI } from '@/constants/asset-keys';
import { CRYSTAL_SHRINE_STATS } from '@/constants/object-stats';
import { Shrine } from '@/entities/misc/shrine';

export class CrystalShrine extends Interactable {
  private health: Health | null = null;
  private circle: Phaser.GameObjects.Arc | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['shrine']);

    const staticShrineZones = this.triggerZones.getChildren();

    // First crystal
    new Shrine({
      scene: this.scene,
      position: {
        x: (staticShrineZones[0] as Phaser.GameObjects.Zone).x,
        y: (staticShrineZones[0] as Phaser.GameObjects.Zone).y,
      },
      keyName: MISC.CRYSTAL_SHRINE,
      frame: 0,
    });

    // Second crystal
    new Shrine({
      scene: this.scene,
      position: {
        x: (staticShrineZones[1] as Phaser.GameObjects.Zone).x,
        y: (staticShrineZones[1] as Phaser.GameObjects.Zone).y,
      },
      keyName: MISC.CRYSTAL_SHRINE,
      frame: 0,
    });

    // Third crystal
    new Shrine({
      scene: this.scene,
      position: {
        x: (staticShrineZones[2] as Phaser.GameObjects.Zone).x,
        y: (staticShrineZones[2] as Phaser.GameObjects.Zone).y,
      },
      keyName: MISC.CRYSTAL_SHRINE,
      frame: 0,
    });
  }

  public override update(delta?: number): void {
    super.update();

    if (this.health && !this.player.getDead()) {
      const dt = (delta ?? 1000) / 1000;

      this.health.heal(CRYSTAL_SHRINE_STATS.HEAL * dt);

      this.ui.reducePlayerHealth(this.health.current, this.health.max);
      this.circle?.setPosition(this.player.x, this.player.y + 6);
    }
  }

  protected onEnter(): void {
    this.health = this.player.getStats().health;
    this.circle = this.scene.add
      .circle(this.player.x, this.player.y + 6, 30, 0x99ffff, 0.25)
      .setDepth(this.player.depth + 1);
    this.ui.addModifierIcon(UI.CRYSTAL_RENEWAL_BUFF, undefined, 'buff');
  }

  protected onInteract(): void {}

  protected onLeave(): void {
    this.ui.removeModifierIcon(UI.CRYSTAL_RENEWAL_BUFF);
    this.health = null;
    this.circle?.destroy();
    this.circle = null;
  }
}
