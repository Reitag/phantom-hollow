import { Player } from '@/objects/characters/player/player';
import { UiManager } from '@/managers/ui-manager';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellManager } from '@/managers/spell-manager';
import { Sandbox } from '@/components/sandbox/sandbox';

interface ServiceMap {
  player: Player;
  ui: UiManager;
  cooldowns: CooldownsState;
  spellFactory: SpellFactory;
  spellManager: SpellManager;
  sandbox: Sandbox;
}

export const ServiceKeys = {
  player: 'player',
  ui: 'ui',
  cooldowns: 'cooldowns',
  spellFactory: 'spellFactory',
  spellManager: 'spellManager',
  sandbox: 'sandbox',
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
