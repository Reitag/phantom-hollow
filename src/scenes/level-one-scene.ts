import Phaser from 'phaser';

import { WORLD_PARAMS } from '@/constants/world-params';
import {
  SPEAR_HIT,
  SPIKE_HIT,
  PLAYER_STATS,
  SKELETON_WARRIOR_STATS,
  ZOMBIE_STATS,
  EVIL_WIZARD_STATS,
} from '@/constants/object-stats';
import { Z_POSITION } from '@/constants/z-position';
import { CHARACTERS, TILESETS } from '@/constants/asset-keys';
import { Player } from '@/entities/characters/player/player';
import { AiSkeletonWarrior } from '@/ai/enemies/ai-skeleton-warrior';
import { AiZombie } from '@/ai/enemies/ai-zombie';
import { AiEvilWizard } from '@/ai/bosses/ai-evil-wizard';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { Zombie } from '@/entities/characters/enemies/zombie';
import { EvilWizzard } from '@/entities/characters/bosses/evil-wizzard';
import { Tilemap } from '@/components/map/tilemap';
import { TILELAYER_NAMES, createTilemapOne } from '@/tilemap/tilemap-one';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { InventorySystem } from '@/systems/inventory-system';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellSystem } from '@/systems/spell-system';
import { Sandbox } from '@/infrastructure/sandbox';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Character } from '@/base/entites/character';
import { Spell } from '@/base/entites/spell';
import { isValidTeleportPosition } from '@/utils/helpers';
import { createHealthPotion, createProtectPotion, createUndyingPotion } from '@/game/items/potions';
import { UiScene } from './ui-scene';
// @ts-expect-error JS import
import { MemoryMonitor } from '../../tools/memory-monitor.js';

export class LevelOneScene extends Phaser.Scene {
  //private readonly playerSpawnPosition = 50;
  //private readonly playerSpawnPosition = 1800;
  private readonly playerSpawnPosition = 11200;
  private readonly skeletonSpawnPositions = [/*700, 1600, 2500, 4100, 4600, 6500, 8600,*/ 11500];
  private readonly zombieSpawnPositions = [/*4700, 5000, 5500, 6400, 7700, 8700, 8800,*/ 11600];
  private readonly evilWizardSpawn = { x: 12200, y: 450 };

  private player!: Player;
  private aiSkeletonWarrior!: AiSkeletonWarrior;
  private aiZombie!: AiZombie;
  private aiEvilWizard!: AiEvilWizard;
  private mount!: Phaser.GameObjects.TileSprite;
  private grass!: Phaser.GameObjects.TileSprite;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private map!: Tilemap;
  private canPlayerGetDamage = true;
  private isGameInitialized = false;

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
    this.aiSkeletonWarrior.update(delta);
    this.aiZombie.update(delta);
    this.aiEvilWizard.update(delta);

    this.mount.tilePositionX = this.camera.scrollX * 0.2;
    this.grass.tilePositionX = this.camera.scrollX * 0.5;
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

    this.createWorldBounds();

    this.registerVitalSystems();
    this.createPlayer();

    this.createSkeletonWarriors();
    this.createZombies();
    this.createBoss();

    this.registerCollisions();
    this.setupCamera();

    const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    const health = createHealthPotion();
    const protect = createProtectPotion();
    const undye = createUndyingPotion();
    inventory.addItem(health, 5);
    inventory.addItem(protect, 5);
    inventory.addItem(undye, 5);
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

  private createTilemap(): void {
    this.map = createTilemapOne(this);
  }

  private createWorldBounds(): void {
    this.physics.world.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private registerVitalSystems(): void {
    ServiceLocator.register(ServiceKeys.cooldowns, new SpellCooldowns(this));
    ServiceLocator.register(ServiceKeys.spellFactory, new SpellFactory(this));
    ServiceLocator.register(ServiceKeys.sandbox, new Sandbox());
    ServiceLocator.register(ServiceKeys.spellSystem, new SpellSystem());
    ServiceLocator.register(ServiceKeys.inventorySystem, new InventorySystem());
  }

  private createPlayer(): void {
    this.player = new Player({
      scene: this,
      position: { x: this.playerSpawnPosition, y: 450 },
      keyName: CHARACTERS.PLAYER,
      frame: 0,
      stats: {
        health: PLAYER_STATS.HEALTH,
        speed: PLAYER_STATS.MOVE,
        meleeAttack: undefined,
        defense: 1,
      },
      facingRight: true,
      isValidTeleportPositionCallback: isValidTeleportPosition([
        this.map.getTileLayer(TILELAYER_NAMES.PLATFORM)!,
        this.map.getTileLayer(TILELAYER_NAMES.SPIKE)!,
        this.map.getTileLayer(TILELAYER_NAMES.GROUND)!,
      ]),
    }).setDepth(Z_POSITION.PLAYER);

    ServiceLocator.register(ServiceKeys.player, this.player);
  }

  private createSkeletonWarriors(): void {
    const collideLayer = this.map.getTileLayer(TILELAYER_NAMES.COLLIDE);
    this.aiSkeletonWarrior = new AiSkeletonWarrior(this.player, collideLayer);

    this.skeletonSpawnPositions.forEach((xPos) => {
      const skeleton = new SkeletonWarrior({
        scene: this,
        position: { x: xPos, y: 500 },
        keyName: CHARACTERS.SKELETON_WARRIOR,
        frame: 0,
        facingRight: false,
        stats: {
          health: SKELETON_WARRIOR_STATS.HEALTH,
          speed: SKELETON_WARRIOR_STATS.WALK,
          meleeAttack: SKELETON_WARRIOR_STATS.HIT,
          defense: undefined,
        },
      });

      skeleton.setDepth(Z_POSITION.ENEMY);
      this.aiSkeletonWarrior.addEnemy(skeleton);
    });
  }
  private createZombies(): void {
    const collideLayer = this.map.getTileLayer(TILELAYER_NAMES.COLLIDE);
    this.aiZombie = new AiZombie(this.player, collideLayer);

    this.zombieSpawnPositions.forEach((xPos) => {
      const zombie = new Zombie({
        scene: this,
        position: { x: xPos, y: 500 },
        keyName: CHARACTERS.ZOMBIE,
        frame: 0,
        facingRight: false,
        stats: {
          health: ZOMBIE_STATS.HEALTH,
          speed: ZOMBIE_STATS.WALK,
          meleeAttack: ZOMBIE_STATS.HIT,
          defense: undefined,
        },
      });

      zombie.setDepth(Z_POSITION.ENEMY);
      this.aiZombie.addEnemy(zombie);
    });
  }

  private createBoss(): void {
    const boss = new EvilWizzard({
      scene: this,
      position: this.evilWizardSpawn,
      keyName: CHARACTERS.EVIL_WIZARD,
      frame: 0,
      facingRight: false,
      stats: {
        health: EVIL_WIZARD_STATS.HEALTH,
        speed: undefined,
        meleeAttack: undefined,
        defense: undefined,
      },
    }).setDepth(120);

    this.aiEvilWizard = new AiEvilWizard(boss, this.player);
  }

  private registerCollisions(): void {
    const platformLayer = this.map.getTileLayer(TILELAYER_NAMES.PLATFORM);
    const spikeLayer = this.map.getTileLayer(TILELAYER_NAMES.SPIKE);
    const groundLayer = this.map.getTileLayer(TILELAYER_NAMES.GROUND);
    const spearLayer = this.map.getTileLayer(TILELAYER_NAMES.SPEAR);
    const collideLayer = this.map.getTileLayer(TILELAYER_NAMES.COLLIDE);
    const caveLayer = this.map.getTileLayer(TILELAYER_NAMES.CAVE);

    const skeletons = this.aiSkeletonWarrior.getEnemies();
    const zombies = this.aiZombie.getEnemies();
    const boss = this.aiEvilWizard.getBoss();
    const spells = ServiceLocator.resolve(ServiceKeys.spellFactory).getSpells();

    // Ground
    if (groundLayer) {
      this.physics.add.collider(this.player, groundLayer); // Player
      this.physics.add.collider(skeletons, groundLayer); // Skeleton warrior
      this.physics.add.collider(zombies, groundLayer); // Zombie
      this.physics.add.collider(boss, groundLayer); // Boss
      this.physics.add.collider(
        spells,
        groundLayer,
        this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Spells
    }

    // Cave
    if (caveLayer) {
      this.physics.add.collider(this.player, caveLayer); // Player
    }

    // Spike
    if (spikeLayer) {
      this.physics.add.collider(this.player, spikeLayer, this.handleSpikeHit, undefined, this);
      this.physics.add.collider(skeletons, spikeLayer); // Skeleton warrior
      this.physics.add.collider(zombies, spikeLayer); // Zombie
    }

    // Spear
    if (spearLayer) {
      this.physics.add.overlap(
        this.player,
        spearLayer,
        this.handleSpearHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Player
    }

    // Platform
    if (platformLayer) {
      this.physics.add.collider(this.player, platformLayer); // Player
      this.physics.add.collider(
        spells,
        platformLayer,
        this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Spells
    }

    // Collide
    if (collideLayer) {
      this.physics.add.collider(
        skeletons,
        collideLayer,
        this.handleEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Skeleton warrior
      this.physics.add.collider(
        zombies,
        collideLayer,
        this.handleEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Zombies
    }

    // Spells
    this.physics.add.overlap(
      spells,
      this.player,
      this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    ); // Player
    this.physics.add.overlap(
      spells,
      skeletons,
      this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    ); // Skeleton warrior
    this.physics.add.overlap(
      spells,
      zombies,
      this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    ); // Zombies
    this.physics.add.overlap(
      spells,
      boss,
      this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    ); // Boss

    // For better collisions
    this.physics.world.setFPS(120);
  }

  private setupCamera(): void {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.camera.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private handleEnemyCollision(enemy: Phaser.GameObjects.GameObject): void {
    if (enemy instanceof Character) {
      if (this.aiSkeletonWarrior.getEnemies().includes(enemy)) {
        this.aiSkeletonWarrior.handleCollision(enemy);
      } else if (this.aiZombie.getEnemies().includes(enemy)) {
        this.aiZombie.handleCollision(enemy);
      }
    }
  }

  private handleSpellCollision(spell: Phaser.GameObjects.GameObject): void {
    if (spell instanceof Spell) {
      spell.destroySpell();
    }
  }

  private handleSpellHit(
    victim: Phaser.GameObjects.GameObject,
    spell: Phaser.GameObjects.GameObject
  ): void {
    if (!(victim instanceof Character) || victim.getDead()) return;
    if (!(spell instanceof Spell) || spell.hasAlreadyHit(victim)) return;

    const victimCenterY = (victim.body as Phaser.Physics.Arcade.Body).center.y;
    const spellCenterY = (spell.body as Phaser.Physics.Arcade.Body).center.y;

    const tolerance = 10;
    if (Math.abs(victimCenterY - spellCenterY) > tolerance) return;

    spell.registerHit(victim);

    spell.applyEffect(victim);

    if (spell.causeDamage() > 0) {
      victim.takeDamage(spell.causeDamage());
      spell.destroySpell();
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

  private handleSpearHit(_: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile): void {
    if (!this.canPlayerGetDamage && !tile) return;

    if (tile.properties.collides) {
      this.player.takeDamage(SPEAR_HIT);
      this.canPlayerGetDamage = false;

      this.time.delayedCall(500, () => {
        this.canPlayerGetDamage = true;
      });
    }
  }
}
