import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { Sandbox } from '@/components/sandbox/sandbox';
import { SpellFactory } from '@/factories/spell-factory';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { BLINK, GLOBAL } from '@/constants/spell-cooldowns';

export class SpellManager {
  private cooldowns: CooldownsState;
  private spellFactory: SpellFactory;
  private sandbox: Sandbox;

  constructor() {
    this.cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    this.spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
    this.sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
  }

  public canCast(spellKey: string): boolean {
    return !this.cooldowns.isOnCooldown(spellKey) && !this.cooldowns.isOnCooldown(GLOBAL.NAME);
  }

  public castFireball(): void {
    const { x, y, direction } = this.sandbox.getPlayerPosition();

    const fireball = this.spellFactory.createFireball(x, y, direction);

    fireball.cast();
    this.sandbox.startGlobalCooldown();
  }

  public castBlink(): void {
    const { x, y, direction } = this.sandbox.getPlayerPosition();

    const blink = this.spellFactory.createBlink(x, y, direction);

    blink.cast();
    this.sandbox.startCooldown(BLINK.NAME, BLINK.DURATION);
  }
}
