import Phaser from 'phaser';

import { WORLD_PARAMS } from '@/constants/world-params';
import { SPEAR_HIT, SPIKE_HIT, PLAYER_STATS } from '@/constants/object-stats';
import { Z_POSITION } from '@/constants/z-position';
import { Item } from '@/base/objects/item';
import { CHARACTERS, TILESETS } from '@/constants/asset-keys';
import { PLAYER_SPAWN_POSITION } from '@/constants/spawn-positions';
import { Player } from '@/entities/characters/player/player';
import { Tilemap } from '@/components/map/tilemap';
import { TILELAYER_NAMES, createTilemapOne } from '@/tilemap/tilemap-one';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Stall } from '@/game/economy/store/stall';
import { InventorySystem } from '@/systems/inventory-system';
import { Arrow } from '@/entities/weapons/arrow';
import { SpellFactory } from '@/factories/spell-factory';
import { LootSystem } from '@/systems/loot-system';
import { Coin } from '@/entities/items/coin';
import { EnemySpawn } from '@/systems/enemy-spawn';
import { SpellSystem } from '@/systems/spell-system';
import { Sandbox } from '@/infrastructure/sandbox';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { Spell } from '@/base/objects/spell';
import { UiScene } from './ui-scene';
// @ts-expect-error JS import
import { MemoryMonitor } from '../../tools/memory-monitor.js';

export class LevelOneScene extends Phaser.Scene {
  private memoryMonitor: MemoryMonitor | null = null;

  private player!: Player;
  private stall!: Stall;
  private mount!: Phaser.GameObjects.TileSprite;
  private grass!: Phaser.GameObjects.TileSprite;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private map!: Tilemap;
  private canPlayerGetDamage = true;
  private isGameInitialized = false;

  private spawn!: EnemySpawn;

  constructor() {
    super('LevelOneScene');
  }

  create(): void {
    if (this.isGameInitialized) return;
    this.isGameInitialized = true;

    this.physics.world.createDebugGraphic();
    this.initUiScene(() => this.createGameWorld());
  }

  update(_: number, delta: number): void {
    this.player.update(delta);
    this.spawn.update(this.player, delta);

    this.stall.update();

    this.updateParallaxBackground();

    // Debug
    if (process.env.NODE_ENV === 'development') {
      if (this.memoryMonitor instanceof MemoryMonitor) {
        this.memoryMonitor?.setPlayersCoords(this.player.x, this.player.y);
      }
    }
    // Debug
  }

  private initUiScene(initWorld: () => void): void {
    this.scene.launch('UiScene');
    this.scene.bringToTop('UiScene');

    const uiScene = this.scene.get('UiScene');

    uiScene.events.once(Phaser.Scenes.Events.CREATE, () => {
      if (uiScene instanceof UiScene) {
        ServiceLocator.register(ServiceKeys.ui, uiScene.getUI());
        initWorld();

        // Debug
        if (process.env.NODE_ENV === 'development') {
          this.scene.add('MemoryMonitor', MemoryMonitor, true);
          this.memoryMonitor = this.scene.get('MemoryMonitor');
        }
        // Debug
      } else {
        throw new Error('UiScene not found or not an instance of UiScene!');
      }
    });
  }

  private createGameWorld(): void {
    this.createParallaxBackground();
    this.createTilemap();

    this.registerEntityGroups();
    this.createWorldBounds();

    this.registerSystems();

    this.createPlayer();
    this.createStall();

    this.registerCollisions();
    this.createSpawnEnemySystem();

    this.setupCamera();
  }

  private createParallaxBackground(): void {
    this.add.image(0, 0, TILESETS.SKY).setOrigin(0);

    this.mount = this.add
      .tileSprite(0, 310, WORLD_PARAMS.WIDTH, 338, TILESETS.MOUNT)
      .setOrigin(0)
      .setScrollFactor(0);

    this.grass = this.add
      .tileSprite(0, 450, WORLD_PARAMS.WIDTH, 130, TILESETS.GRASS)
      .setOrigin(0)
      .setScrollFactor(0);
  }

  private updateParallaxBackground(): void {
    this.mount.tilePositionX = this.camera.scrollX * 0.2;
    this.grass.tilePositionX = this.camera.scrollX * 0.5;
  }

  private createTilemap(): void {
    this.map = createTilemapOne(this);

    [
      TILELAYER_NAMES.PLATFORM,
      TILELAYER_NAMES.SPIKE,
      TILELAYER_NAMES.GROUND,
      TILELAYER_NAMES.SPEAR,
      TILELAYER_NAMES.CAVE,
    ].forEach((layerName) => {
      const layer = this.map.getTileLayer(layerName);
      if (layer === null) throw new Error('Layer is null');
      CollisionService.registerLayer({ name: layerName, layer: layer });
    });
  }

  private registerEntityGroups(): void {
    CollisionService.registerGroup(
      GroupKeys.spell,
      this.physics.add.group({
        runChildUpdate: true,
        allowGravity: false,
      })
    );

    CollisionService.registerGroup(
      GroupKeys.weapon,
      this.physics.add.group({
        runChildUpdate: true,
        allowGravity: false,
      })
    );

    CollisionService.registerGroup(
      GroupKeys.enemy,
      this.physics.add.group({
        allowGravity: true,
      })
    );

    CollisionService.registerGroup(
      GroupKeys.item,
      this.physics.add.group({
        allowGravity: true,
      })
    );
  }

  private createWorldBounds(): void {
    this.physics.world.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private registerSystems(): void {
    ServiceLocator.register(ServiceKeys.cooldowns, new SpellCooldowns(this));
    ServiceLocator.register(ServiceKeys.spellFactory, new SpellFactory(this));
    ServiceLocator.register(ServiceKeys.sandbox, new Sandbox());
    ServiceLocator.register(ServiceKeys.spellSystem, new SpellSystem());
    ServiceLocator.register(ServiceKeys.inventorySystem, new InventorySystem());
    ServiceLocator.register(ServiceKeys.lootSystem, new LootSystem(this));
    ServiceLocator.register(ServiceKeys.collision, new CollisionService());
  }

  private createPlayer(): void {
    this.player = new Player({
      scene: this,
      position: PLAYER_SPAWN_POSITION,
      keyName: CHARACTERS.PLAYER,
      frame: 0,
      stats: {
        health: PLAYER_STATS.HEALTH,
        speed: PLAYER_STATS.MOVE,
        damage: {
          meleeAttack: undefined,
          spellPower: PLAYER_STATS.SPELL_POWER,
        },
        defense: 1,
        aggro: false,
      },
      facingRight: true,
    }).setDepth(Z_POSITION.PLAYER);

    ServiceLocator.register(ServiceKeys.player, this.player);
  }

  private createStall(): void {
    this.stall = new Stall(this);
  }

  private registerCollisions(): void {
    const enemies = CollisionService.resolveGroup(GroupKeys.enemy);
    const spells = CollisionService.resolveGroup(GroupKeys.spell);
    const weapons = CollisionService.resolveGroup(GroupKeys.weapon);
    const items = CollisionService.resolveGroup(GroupKeys.item);

    const ground = CollisionService.resolveLayer(TILELAYER_NAMES.GROUND);
    const platform = CollisionService.resolveLayer(TILELAYER_NAMES.PLATFORM);
    const cave = CollisionService.resolveLayer(TILELAYER_NAMES.CAVE);
    const spikes = CollisionService.resolveLayer(TILELAYER_NAMES.SPIKE);
    const spear = CollisionService.resolveLayer(TILELAYER_NAMES.SPEAR);

    // Common collision
    [ground, platform, cave].forEach((layer) => {
      CollisionService.registerCollisions(this, layer, [
        { entity: this.player },
        {
          entity: enemies,
          callback: this.handleEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
        {
          entity: spells,
          callback: this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
        { entity: items },
      ]);
    });

    // Spikes
    CollisionService.registerCollisions(this, spikes, [
      {
        entity: this.player,
        callback: this.handleSpikeHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      },
      { entity: enemies },
    ]);

    // Spears
    [this.player, enemies].forEach((entity) => {
      CollisionService.registerCollisions(this, spear, [
        {
          entity,
          callback: this.handleSpearHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          type: 'overlap',
        },
      ]);
    });

    // Spells
    const projectileCollisions = [this.player, enemies].map((e) => ({
      entity: e,
      callback: this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      type: 'overlap' as const,
    }));
    CollisionService.registerCollisions(this, spells, projectileCollisions);

    // Weapons
    [platform!, spikes!, ground!, cave!].forEach((layer) => {
      CollisionService.registerCollisions(this, weapons, [
        {
          entity: layer,
          callback: this.handleWeaponCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          type: 'overlap',
        },
      ]);
    });

    CollisionService.registerCollisions(this, weapons, [
      {
        entity: this.player,
        callback: this.handleWeaponHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        type: 'overlap',
      },
    ]);

    // Items
    CollisionService.registerCollisions(this, items, [
      {
        entity: this.player,
        callback: this.handlePickup as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        type: 'overlap',
      },
    ]);

    // For better collisions
    this.physics.world.setFPS(120);
  }

  private createSpawnEnemySystem(): void {
    this.spawn = new EnemySpawn(this);
  }

  private setupCamera(): void {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.camera.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private handleEnemyCollision(enemy: Phaser.GameObjects.GameObject): void {
    if (!(enemy instanceof Character)) return;

    const collision = ServiceLocator.resolve(ServiceKeys.collision);
    if (collision.isEntityColliding(enemy)) {
      enemy.flipCharacterToRight(!enemy.getFacingRight());
    }
  }

  private handleSpellCollision(
    spell: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ): void {
    if (spell instanceof Spell) {
      if (tile.properties.collides) {
        spell.destroySpell();
      }
    }
  }

  private handleSpellHit(
    victim: Phaser.GameObjects.GameObject,
    spell: Phaser.GameObjects.GameObject
  ): void {
    if (!(victim instanceof Character) || victim.getDead()) return;
    if (!(spell instanceof Spell) || spell.hasAlreadyHit(victim)) return;

    spell.registerHit(victim);

    spell.applyEffect(victim);

    if (spell.causeDamage() > 0) {
      victim.takeDamage(spell.causeDamage(), spell.getCaster());
      spell.destroySpell();
    }
  }

  private handleWeaponCollision(
    weapon: Phaser.GameObjects.GameObject,
    target: Phaser.Tilemaps.Tile
  ): void {
    if (target instanceof Phaser.Tilemaps.Tile) {
      if (target.properties.collides && weapon.active) {
        weapon.destroy();
      }
    }
  }

  private handleWeaponHit(
    target: Phaser.GameObjects.GameObject,
    weapon: Phaser.GameObjects.GameObject
  ): void {
    if (target instanceof Player && weapon instanceof Arrow) {
      target.takeDamage(10);
      weapon.destroy();
    }
  }

  private handleSpikeHit(): void {
    if (!this.canPlayerGetDamage) return;

    this.player.takeDamage(SPIKE_HIT);
    this.canPlayerGetDamage = false;

    this.time.delayedCall(500, () => {
      this.canPlayerGetDamage = true;
    });
  }

  private handleSpearHit(target: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile): void {
    if (!tile) return;

    if (target instanceof Character) {
      if (tile.properties.collides) {
        target.takeDamage(SPEAR_HIT);
      }
    }
  }

  private handlePickup(character: Phaser.GameObjects.GameObject, item: Item): void {
    if (character instanceof Player && item instanceof Coin) {
      character.getCoinKeeper().addCoins(1);
    }

    item.destroy();
  }
}
