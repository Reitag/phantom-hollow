import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { MISC } from '@/constants/asset-keys';
import { SoulFire } from '@/entities/misc/soul-fire';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { soulStone } from '../items/stones';

type SoulFireConfig = {
  fire: SoulFire | null;
  x: number;
};

export class SoulPedestal extends Interactable {
  private soulFire: SoulFireConfig = { fire: null, x: 0 };

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['soul-pedestal']);
  }

  protected onEnter(): void {
    this.scene.events.on('trigger-soul-stone', this.setSoulStone, this);
    this.scene.registry.set('active-soul-pedestal', this);
  }
  protected onInteract(): void {}

  protected onLeave(): void {
    this.scene.events.off('trigger-soul-stone', this.setSoulStone, this);
    this.scene.registry.set('active-soul-pedestal', null);
  }

  private setSoulStone(): void {
    const playerHandler = ServiceLocator.resolve(ServiceKeys.playerHandler);
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const stone = soulStone();
    const stoneIndex = inventory.getItemIndex(stone.id);

    if (!this.activeZone) return;
    if (stoneIndex === undefined) return;

    const fireX = this.activeZone.x;
    const fireY = this.activeZone.y - this.activeZone.height / 2;

    if (this.soulFire.x === fireX) {
      ui.addWarningtext('This pedestal is already bounded');
      return;
    }

    const fire = new SoulFire({
      scene: this.scene,
      position: { x: fireX, y: fireY },
      keyName: MISC.SOUL_FIRE,
      frame: 0,
    });

    const newSpawn = { x: this.activeZone.x, y: this.activeZone.y };
    playerHandler.setNewResurrectPosition(newSpawn);
    inventory.removeItem(stoneIndex);

    if (this.soulFire.fire?.active) {
      this.soulFire.fire.destroy();
    }

    this.soulFire.fire = fire;
    this.soulFire.x = fireX;
  }
}
