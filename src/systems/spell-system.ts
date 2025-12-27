import { Character } from '@/base/objects/character';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Sandbox } from '@/infrastructure/sandbox';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { BLINK, FROST_BOLT, GLOBAL, WIND } from '@/constants/spell-cooldowns';
import { getUiCoords } from '@/utils/helpers';

export class SpellSystem {
  private cooldowns: SpellCooldowns;
  private spellFactory: SpellFactory;
  private sandbox: Sandbox;
  private uiCoords: Phaser.Types.Tilemaps.TiledObject[];

  constructor() {
    this.cooldowns = ServiceLocator.resolve(ServiceKeys.cooldowns);
    this.spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
    this.sandbox = ServiceLocator.resolve(ServiceKeys.sandbox);
    this.uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
  }

  public canCast(spellKey: string): boolean {
    return !this.cooldowns.isOnCooldown(spellKey) && !this.cooldowns.isOnCooldown(GLOBAL.NAME);
  }

  public castFireball(character: Character): void {
    const fireball = this.spellFactory.createFireball(character);

    fireball.cast();
    this.sandbox.startGlobalCooldown();
  }

  public castBlink(character: Character): void {
    const blink = this.spellFactory.createBlink(character);

    blink.cast();
    this.sandbox.startCooldown(BLINK.NAME, getUiCoords(this.uiCoords, 'secondary'), BLINK.DURATION);
  }

  public castWind(character: Character): void {
    const wind = this.spellFactory.createWind(character);

    wind.cast();
    this.sandbox.startCooldown(WIND.NAME, getUiCoords(this.uiCoords, 'tertiary'), WIND.DURATION);
  }

  public castFrostbolt(character: Character): void {
    const frostBolt = this.spellFactory.createFrostBolt(character);

    frostBolt.cast();
    this.sandbox.startCooldown(
      FROST_BOLT.NAME,
      getUiCoords(this.uiCoords, 'quaternary'),
      FROST_BOLT.DURATION
    );
  }
}
