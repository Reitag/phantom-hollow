import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { MISC, OBJECTS } from '@/constants/asset-keys';
import { LOOT_ZONE_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';
import { Shining } from '@/entities/misc/shining';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { InventoryItem } from '@/utils/types';

interface Loot {
  id: string;
  amount: number;
}

interface LootZoneData {
  zone: Phaser.GameObjects.Zone;
  chestSprite?: Phaser.GameObjects.Image;
  loot: Loot[];
  activated: boolean;
  vfx?: Shining;
}

export class LootZone extends Interactable {
  private lootZones: LootZoneData[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['chest']);

    // Static loot zone array
    const staticLootZones = this.triggerZones.getChildren();

    // First static loot zone
    const firstLootZone = this.scene.add
      .image(
        (staticLootZones[0] as Phaser.GameObjects.Zone).x,
        (staticLootZones[0] as Phaser.GameObjects.Zone).y,
        OBJECTS.CHEST_CLOSE,
        0
      )
      .setOrigin(0, 0)
      .setDepth(Z_POSITION.DECOR);

    this.lootZones.push({
      zone: staticLootZones[0] as Phaser.GameObjects.Zone,
      chestSprite: firstLootZone,
      loot: [
        { id: 'health-potion', amount: 3 },
        { id: 'protect-potion', amount: 2 },
      ],
      activated: false,
      vfx: new Shining({
        scene: this.scene,
        position: {
          x: (staticLootZones[0] as Phaser.GameObjects.Zone).x,
          y: (staticLootZones[0] as Phaser.GameObjects.Zone).y,
        },
        keyName: MISC.SHINING,
        frame: 0,
      }),
    });

    // Second chest
    // code
  }

  public createLootZone(zone: Phaser.GameObjects.Zone, loot: Loot[]): void {
    this.lootZones.push({
      zone,
      chestSprite: undefined,
      loot,
      activated: false,
      vfx: new Shining({
        scene: this.scene,
        position: {
          x: zone.x,
          y: zone.y,
        },
        keyName: MISC.SHINING,
        frame: 0,
      }),
    });

    this.triggerZones.add(zone, true);
  }

  protected onEnter(): void {
    const lootZone = this.getActiveLootZone();
    if (!lootZone || lootZone.activated) return;

    this.ui.showHorizontalTooltip(
      {
        x: INTERACT_TOOLTIP.X,
        y: INTERACT_TOOLTIP.Y,
        width: INTERACT_TOOLTIP.WIDTH,
        fillColor: INTERACT_TOOLTIP.FILL_COLOR,
      },
      LOOT_ZONE_TOOLTIP
    );
  }

  protected onInteract(): void {
    const lootZone = this.getActiveLootZone();
    if (!lootZone || lootZone.activated) return;

    const success = this.tryAddLoot(lootZone.loot);

    if (!success) {
      ServiceLocator.resolve(ServiceKeys.ui).addWarningtext('The inventory is full');
      return;
    }
    this.ui.hideTooltip();
    lootZone.activated = true;
    lootZone.vfx?.destroy();
    lootZone.vfx = undefined;
    lootZone.loot = [];

    if (lootZone.chestSprite) {
      lootZone.chestSprite.setTexture(OBJECTS.CHEST_OPEN);
    }
  }

  protected onLeave(): void {
    this.ui.hideTooltip();
  }

  private tryAddLoot(loot: { id: string; amount: number }[]): boolean {
    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

    for (const entry of loot) {
      const item = this.createLootById(entry.id);
      if (!item) return false;

      if (!inventory.canAdd(item, entry.amount)) {
        return false;
      }
    }

    for (const entry of loot) {
      const item = this.createLootById(entry.id)!;
      inventory.addItem(item, entry.amount);
    }

    return true;
  }

  private createLootById(id: string): InventoryItem | null {
    const loot = LOOT_FACTORY[id];
    return loot ? loot() : null;
  }

  private getActiveLootZone(): LootZoneData | null {
    if (!this.activeZone) return null;

    return this.lootZones.find((lootZone) => lootZone.zone === this.activeZone) ?? null;
  }
}
