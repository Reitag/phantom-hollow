import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { AUDIO, MISC, OBJECTS } from '@/constants/asset-keys';
import { LOOT_ZONE_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';
import { Shining } from '@/entities/misc/shining';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SaveService } from '@/infrastructure/save-service';
import { InventoryItem } from '@/utils/types';
import { QUEST_IDS } from '@/constants/quest-ids';
import { LevelOneScene } from '@/scenes/level-one-scene';

interface Loot {
  id: string;
  amount: number;
}

interface LootZoneData {
  id: string;
  type: 'chest' | 'drop';
  zone: Phaser.GameObjects.Zone;
  sprite?: Phaser.GameObjects.Image;
  loot: Loot[];
  activated: boolean;
  vfx?: Shining;
}

export class LootZone extends Interactable {
  private lootZones: LootZoneData[] = [];
  private crystals: (Phaser.GameObjects.Image | undefined)[] = new Array(3);

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['chest']);

    const save = ServiceLocator.resolve(ServiceKeys.save);

    // Static loot zone array
    const staticLootZones = this.triggerZones.getChildren();

    // Chests
    for (let i = 0; i < 4; i++) {
      const zoneEl = staticLootZones[i] as Phaser.GameObjects.Zone;
      const chestSprite = this.scene.add
        .image(zoneEl.x, zoneEl.y, OBJECTS.CHEST_CLOSE, 0)
        .setOrigin(0, 0)
        .setDepth(Z_POSITION.DECOR);

      let loot: Loot[] = [];
      if (i === 0)
        loot = [
          { id: 'health-potion', amount: 3 },
          { id: 'protect-potion', amount: 2 },
        ];
      else if (i === 1) loot = [{ id: 'spell-potion', amount: 2 }];
      else if (i === 2) loot = [{ id: 'undying-potion', amount: 1 }];
      else if (i === 3) loot = [{ id: 'lightning-potion', amount: 2 }];

      this.lootZones.push({
        id: `chest-${i + 1}`,
        type: 'chest',
        zone: zoneEl,
        sprite: chestSprite,
        loot,
        activated: false,
        vfx: new Shining({
          scene: this.scene,
          position: { x: zoneEl.x, y: zoneEl.y },
          keyName: MISC.SHINING,
          frame: 0,
        }),
      });
    }

    // Spawn crystals as image
    const crystals = (this.scene as LevelOneScene).getCrystalZones();
    if (SaveService.getQuestState(QUEST_IDS.CRYSTAL) === 'pending') {
      crystals.forEach((pos, index) => {
        if (pos) {
          this.crystals[index] = scene.add
            .image(pos.x, pos.y, OBJECTS.CRYSTAL_WHITE)
            .setOrigin(0, 0)
            .setDepth(Z_POSITION.DECOR);
        } else {
          this.crystals[index] = undefined;
        }
      });
    }

    if (save) {
      // Chests
      this.lootZones.forEach((zone) => {
        if (save.worldState.openedChest.includes(zone.id)) {
          zone.activated = true;
          zone.loot = [];
          zone.vfx?.destroy();
          zone.vfx = undefined;

          if (zone.sprite) {
            zone.sprite.setTexture(OBJECTS.CHEST_OPEN);
          }
        }
      });

      // Quests loot
      save.worldState.droppedLoot.forEach((drop) => {
        if (drop.id === 'fireworm-fang-1') {
          const zone = scene.add.zone(drop.x - 14, drop.y, 32, 32).setOrigin(0, 0);
          this.createLootZone(drop.id, zone, drop.loot);
        } else if (drop.id.startsWith('crystal-')) {
          if (SaveService.getQuestState(QUEST_IDS.CRYSTAL) === 'waiting') {
            const index = parseInt(drop.id.replace('crystal-', '')) - 1;

            if (!isNaN(index) && index >= 0 && index < this.crystals.length) {
              this.crystals[index] = scene.add
                .image(drop.x, drop.y, OBJECTS.CRYSTAL_WHITE)
                .setOrigin(0, 0)
                .setDepth(Z_POSITION.DECOR);
            }

            const zone = scene.add.zone(drop.x, drop.y, 32, 32).setOrigin(0, 0);
            this.createLootZone(drop.id, zone, drop.loot);
          }
        } else {
          const zone = scene.add.zone(drop.x, drop.y, 32, 32).setOrigin(0, 0);
          this.createLootZone(drop.id, zone, drop.loot);
        }
      });
    }
  }

  public createLootZone(id: string, zone: Phaser.GameObjects.Zone, loot: Loot[]): void {
    this.lootZones.push({
      id,
      type: 'drop',
      zone,
      sprite: undefined,
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

    if (lootZone.type === 'chest') {
      if (lootZone.sprite) {
        lootZone.sprite.setTexture(OBJECTS.CHEST_OPEN);
        ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.CHEST_OPEN);
      }

      SaveService.patch({
        worldState: {
          ...SaveService.data.worldState,
          openedChest: [...SaveService.data.worldState.openedChest, lootZone.id],
        },
      });
    }

    if (lootZone.type === 'drop') {
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.LOOT_COLLECT);

      // Same as dropId in LevelOneScene the function 'spawnLoot'
      if (lootZone.id.startsWith('crystal-')) {
        const index = parseInt(lootZone.id.replace('crystal-', '')) - 1;
        const crystalAsset = this.crystals[index];

        if (crystalAsset) {
          crystalAsset.destroy();
          this.crystals[index] = undefined;
        }
      }

      SaveService.patch({
        worldState: {
          ...SaveService.data.worldState,
          droppedLoot: SaveService.data.worldState.droppedLoot.filter((l) => l.id !== lootZone.id),
        },
      });
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
