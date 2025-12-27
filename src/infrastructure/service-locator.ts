import { UiSystem } from '@/systems/ui-system';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Tilemap } from '@/components/map/tilemap';
import { PlayerHandler } from '@/systems/player-handler';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellSystem } from '@/systems/spell-system';
import { LootSystem } from '@/systems/loot-system';
import { Sandbox } from '@/infrastructure/sandbox';
import { InventorySystem } from '@/systems/inventory-system';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { CollisionService } from './collision-service';

interface ServiceMap {
  playerHandler: PlayerHandler;
  ui: UiSystem;
  uiCoords: Phaser.Types.Tilemaps.TiledObject[];
  cooldowns: SpellCooldowns;
  spellFactory: SpellFactory;
  spellSystem: SpellSystem;
  sandbox: Sandbox;
  inventorySystem: InventorySystem;
  lootSystem: LootSystem;
  input: KeyboardController;
  map: Tilemap;
  collision: CollisionService;
}

export const ServiceKeys = {
  playerHandler: 'playerHandler',
  ui: 'ui',
  uiCoords: 'uiCoords',
  cooldowns: 'cooldowns',
  spellFactory: 'spellFactory',
  spellSystem: 'spellSystem',
  sandbox: 'sandbox',
  inventorySystem: 'inventorySystem',
  lootSystem: 'lootSystem',
  input: 'input',
  map: 'map',
  collision: 'collision',
} as const;

export class ServiceLocator {
  private static services = new Map<keyof ServiceMap, unknown>();

  public static register<K extends keyof ServiceMap>(key: K, instance: ServiceMap[K]): void {
    this.services.set(key, instance);
  }

  public static resolve<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service not found: ${String(key)}`);
    }
    return service as ServiceMap[K];
  }

  public static clear(): void {
    this.services.clear();
  }
}
