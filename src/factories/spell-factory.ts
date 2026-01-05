import { Character } from '@/base/objects/character';
import { SpellPower } from '@/components/stats/damage';
import { FireBall } from '@/entities/spells/direct-spells/fire-ball';
import { Blink } from '@/entities/spells/effect-spells/blink';
import { LightningShield } from '@/entities/spells/effect-spells/lightning-shield';
import { EarthShake } from '@/entities/spells/aura-spells/earth-shake';
import { WindPulse } from '@/entities/spells/effect-spells/wind-pulse';
import { FrostBolt } from '@/entities/spells/direct-spells/frost-bolt';
import { ShadowBolt } from '@/entities/spells/direct-spells/shadow-bolt';
import { ShadowTrail } from '@/entities/spells/direct-spells/shadow-trail';
import { SPELLS } from '@/constants/asset-keys';
import {
  FIRE_BALL_STATS,
  SHADOW_BOLT_STATS,
  FROST_BOLT_STATS,
  LIGHTNING_SHIELD_STATS,
  EARTH_SHAKE_STATS,
  SHADOW_TRAIL_STATS,
} from '@/constants/object-stats';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';

export class SpellFactory {
  private spellGroup!: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    const spellGroup = CollisionService.resolveGroup(GroupKeys.spell);
    if (spellGroup) {
      this.spellGroup = spellGroup;
    }
  }

  public createFireball(character: Character, position?: { x: number; y: number }): FireBall {
    const spawnPosition = position ?? this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const fireBall = new FireBall({
      scene: this.scene,
      position: spawnPosition,
      keyName: SPELLS.FIRE_BALL,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: FIRE_BALL_STATS.HIT,
      speed: FIRE_BALL_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(fireBall, true);

    return fireBall;
  }

  public createBlink(character: Character): Blink {
    const position = character.getPosition();
    const direction = character.getFacingRight() ? 1 : -1;

    const blink = new Blink({
      scene: this.scene,
      position: position,
      keyName: SPELLS.BLINK,
      frame: 0,
      caster: character,
      direction: direction,
    });

    this.spellGroup.add(blink, true);

    return blink;
  }

  public createWindPulse(character: Character, position?: { x: number; y: number }): WindPulse {
    const spawnPosition = position ?? this.getSpellSpawnPosition(character);

    const wind = new WindPulse(this.scene, spawnPosition, character);

    const waves = wind.getWindWaves();
    Object.values(waves).forEach((wave) => {
      this.spellGroup.add(wave, true);
    });

    return wind;
  }

  public createFrostBolt(character: Character, position?: { x: number; y: number }): FrostBolt {
    const spawnPosition = position ?? this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const frostBolt = new FrostBolt({
      scene: this.scene,
      position: spawnPosition,
      keyName: SPELLS.FROST_BOLT,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: FROST_BOLT_STATS.HIT,
      speed: FROST_BOLT_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(frostBolt, true);

    return frostBolt;
  }

  public createShadowBolt(character: Character, position?: { x: number; y: number }): ShadowBolt {
    const spawnPosition = position ?? this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const shadowBolt = new ShadowBolt({
      scene: this.scene,
      position: spawnPosition,
      keyName: SPELLS.SHADOW_BOLT,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: SHADOW_BOLT_STATS.HIT,
      speed: SHADOW_BOLT_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(shadowBolt, true);

    return shadowBolt;
  }

  public createShadowTrail(character: Character, position?: { x: number; y: number }): ShadowTrail {
    const spawnPosition = position ?? this.getSpellSpawnPosition(character);
    const direction = character.getFacingRight() ? 1 : -1;
    const spellPower = character.getStats().damage.spellPower as SpellPower;

    const shadowTrail = new ShadowTrail({
      scene: this.scene,
      position: spawnPosition,
      keyName: SPELLS.SHADOW_TRAIL,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: SHADOW_TRAIL_STATS.HIT,
      speed: SHADOW_TRAIL_STATS.SPEED,
      direction: direction,
    });

    this.spellGroup.add(shadowTrail, true);

    return shadowTrail;
  }

  public createLightningShield(
    character: Character,
    position?: { x: number; y: number }
  ): LightningShield {
    const spawnPosition = { x: character.x, y: character.y };
    const spellPower = (character.getStats().damage.spellPower as SpellPower) ?? null;

    const lightningShield = new LightningShield({
      scene: this.scene,
      position: spawnPosition,
      keyName: SPELLS.LIGHTNING_SHIELD,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: LIGHTNING_SHIELD_STATS.HIT,
    });

    this.spellGroup.add(lightningShield, true);

    return lightningShield;
  }

  public createEarthShake(character: Character, position: { x: number; y: number }): EarthShake {
    const spellPower = (character.getStats().damage.spellPower as SpellPower) ?? null;

    const earthShake = new EarthShake({
      scene: this.scene,
      position: position,
      keyName: SPELLS.EARTH_SHAKE,
      frame: 0,
      caster: character,
      spellPower: spellPower,
      damage: EARTH_SHAKE_STATS.HIT,
    });

    this.spellGroup.add(earthShake, true);

    return earthShake;
  }

  public getSpells(): Phaser.Physics.Arcade.Group {
    return this.spellGroup;
  }

  private getSpellSpawnPosition(character: Character): { x: number; y: number } {
    const { x, y } = character.getPosition();
    const flip = character.getFacingRight() ? 1 : -1;

    const handOffsetX = 40 * flip;
    const handOffsetY = character.height / 8;

    return { x: x + handOffsetX, y: y + handOffsetY };
  }
}
