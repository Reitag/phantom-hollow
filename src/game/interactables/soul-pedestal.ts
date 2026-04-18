import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { MISC } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { SoulFire } from '@/entities/misc/soul-fire';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { soulStone } from '../items/stones';

type PedestalData = {
  id: string;
  zone: Phaser.GameObjects.Zone;
  fire?: SoulFire;
  activated: boolean;
};

export class SoulPedestal extends Interactable {
  private pedestals: PedestalData[] = [];
  private activePedestalId: string | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['soul-pedestal']);

    const save = ServiceLocator.resolve(ServiceKeys.save);
    const zones = this.triggerZones.getChildren();

    this.createPedestal('pedestal-1', zones[0] as Phaser.GameObjects.Zone);
    this.createPedestal('pedestal-2', zones[1] as Phaser.GameObjects.Zone);
    this.createPedestal('pedestal-3', zones[2] as Phaser.GameObjects.Zone);

    // Restore activate pedestal
    if (save?.worldState.activePedestal) {
      const active = this.pedestals.find((p) => p.id === save.worldState.activePedestal);

      if (active) {
        this.activatePedestal(active);
      }
    }
  }

  protected onEnter(): void {
    this.scene.events.on('trigger-soul-stone', this.bindSoul, this);
    this.scene.registry.set('active-soul-pedestal', this);
  }
  protected onInteract(): void {}

  protected onLeave(): void {
    this.scene.events.off('trigger-soul-stone', this.bindSoul, this);
    this.scene.registry.remove('active-soul-pedestal');
  }

  private createPedestal(id: string, zone: Phaser.GameObjects.Zone): void {
    this.pedestals.push({
      id,
      zone,
      activated: false,
    });
  }

  private bindSoul(): void {
    const pedestal = this.getActivePedestal();
    if (!pedestal) return;

    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const playerHandler = ServiceLocator.resolve(ServiceKeys.playerHandler);
    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    // Already activated pedestal
    if (pedestal.activated) {
      ui.addWarningtext('This pedestal is already bound');
      return;
    }

    const stone = soulStone();
    const stoneIndex = inventory.getItemIndex(stone.id);

    if (stoneIndex === undefined) {
      ui.addWarningtext('You need a Soul Stone to bind this pedestal');
      return;
    }

    // Deactivate curren pedestal
    if (this.activePedestalId) {
      const previous = this.pedestals.find((p) => p.id === this.activePedestalId);
      if (previous && previous.fire) {
        previous.fire.destroy();
        previous.activated = false;
      }
    }

    // Activate new pedestal
    this.activatePedestal(pedestal);

    this.activePedestalId = pedestal.id;

    // Set new respawn
    const newSpawn = {
      x: pedestal.zone.x + 16,
      y: pedestal.zone.y + 40,
    };
    playerHandler.setNewResurrectPosition(newSpawn);

    // Destroy soul stone
    inventory.destroySlot(stoneIndex);

    // Save
    SaveService.patch({
      spawn: newSpawn,
      scene: this.scene.scene.key,
      worldState: {
        ...SaveService.data.worldState,
        activePedestal: pedestal.id,
      },
    });
  }

  private activatePedestal(pedestal: PedestalData): void {
    if (pedestal.activated) return;

    const fire = new SoulFire({
      scene: this.scene,
      position: {
        x: pedestal.zone.x,
        y: pedestal.zone.y - pedestal.zone.height / 2,
      },
      keyName: MISC.SOUL_FIRE,
      frame: 0,
    }).setDepth(Z_POSITION.DECOR);

    pedestal.fire = fire;
    pedestal.activated = true;
  }

  private getActivePedestal(): PedestalData | null {
    if (!this.activeZone) return null;

    return this.pedestals.find((p) => p.zone === this.activeZone) ?? null;
  }
}
