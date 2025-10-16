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
import { Stall } from '@/game/economy/store/stall';
import { InventorySystem } from '@/systems/inventory-system';
import { SpellFactory } from '@/factories/spell-factory';
import { LootSystem } from '@/systems/loot-system';
import { SpellSystem } from '@/systems/spell-system';
import { Sandbox } from '@/infrastructure/sandbox';
import { CollisionService } from '@/infrastructure/collision-service';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { Spell } from '@/base/objects/spell';
import { UiScene } from './ui-scene';
// @ts-expect-error JS import
import { MemoryMonitor } from '../../tools/memory-monitor.js';

export class LevelOneScene extends Phaser.Scene {
  private readonly playerSpawnPosition = 50;
  //private readonly playerSpawnPosition = 1800;
  //private readonly playerSpawnPosition = 11200;
  //private readonly playerSpawnPosition = 6800;
  private readonly skeletonSpawnPositions = [
    { x: 540, y: 520 },
    { x: 1290, y: 520 },
    { x: 2360, y: 520 },
    { x: 3380, y: 328 },
    { x: 3530, y: 456 },
    { x: 2250, y: 328 },
    { x: 2590, y: 328 },
    { x: 6210, y: 488 },
    { x: 7050, y: 520 },
  ];
  private readonly zombieSpawnPositions = [
    { x: 1650, y: 520 },
    { x: 2670, y: 488 },
    { x: 3080, y: 392 },
    { x: 3060, y: 520 },
    { x: 3335, y: 520 },
    { x: 3420, y: 200 },
    { x: 5760, y: 520 },
    { x: 7290, y: 520 },
  ];
  private readonly evilWizardSpawn = { x: 12200, y: 450 };

  private readonly coinSpawnPositions = [
    { x: 7000, y: 350 },
    { x: 7100, y: 350 },
    { x: 7500, y: 350 },
    { x: 7800, y: 350 },
    { x: 7900, y: 350 },
    { x: 7950, y: 450 },
  ];

  private memoryMonitor: MemoryMonitor | null = null;

  private player!: Player;
  private aiSkeletonWarrior!: AiSkeletonWarrior;
  private aiZombie!: AiZombie;
  private aiEvilWizard!: AiEvilWizard;
  private stall!: Stall;
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

    this.createWorldBounds();

    this.registerSystems();

    this.createPlayer();
    this.createSkeletonWarriors();
    this.createZombies();
    this.createBoss();

    this.createStall();
    this.registerCollisions();

    this.createItems();
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
    ServiceLocator.register(ServiceKeys.collision, new CollisionService(this));
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

  private createSkeletonWarriors(): void {
    this.aiSkeletonWarrior = new AiSkeletonWarrior(this.player);

    let time;

    this.skeletonSpawnPositions.forEach((xPos) => {
      time = Phaser.Math.Between(500, 4500);

      this.time.delayedCall(time, () => {
        const skeleton = new SkeletonWarrior({
          scene: this,
          position: { x: xPos.x, y: xPos.y },
          keyName: CHARACTERS.SKELETON_WARRIOR,
          frame: 0,
          facingRight: false,
          stats: {
            health: SKELETON_WARRIOR_STATS.HEALTH,
            speed: SKELETON_WARRIOR_STATS.WALK,
            damage: {
              meleeAttack: SKELETON_WARRIOR_STATS.HIT,
              spellPower: undefined,
            },
            defense: undefined,
            aggro: true,
          },
        });

        skeleton.setDepth(Z_POSITION.ENEMY);
        this.aiSkeletonWarrior.addEnemy(skeleton);
      });
    });
  }
  private createZombies(): void {
    this.aiZombie = new AiZombie(this.player);

    let time;

    this.zombieSpawnPositions.forEach((xPos) => {
      time = Phaser.Math.Between(500, 4500);

      this.time.delayedCall(time, () => {
        const zombie = new Zombie({
          scene: this,
          position: { x: xPos.x, y: xPos.y },
          keyName: CHARACTERS.ZOMBIE,
          frame: 0,
          facingRight: false,
          stats: {
            health: ZOMBIE_STATS.HEALTH,
            speed: ZOMBIE_STATS.WALK,
            damage: {
              meleeAttack: ZOMBIE_STATS.HIT,
              spellPower: undefined,
            },
            defense: undefined,
            aggro: true,
          },
        });

        zombie.setDepth(Z_POSITION.ENEMY);
        this.aiZombie.addEnemy(zombie);
      });
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
        damage: {
          meleeAttack: undefined,
          spellPower: EVIL_WIZARD_STATS.SPELL_POWER,
        },
        defense: undefined,
        aggro: true,
      },
    }).setDepth(120);

    this.aiEvilWizard = new AiEvilWizard(boss, this.player);
  }

  private createStall(): void {
    this.stall = new Stall(this);
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
    const collision = ServiceLocator.resolve(ServiceKeys.collision);

    // Ground
    if (groundLayer) {
      collision.registerLayerCollisions(groundLayer, [
        { entity: this.player },
        { entity: skeletons },
        { entity: zombies },
        { entity: boss },
        {
          entity: spells,
          callback: this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
      ]);
    }

    // Cave
    if (caveLayer) {
      collision.registerLayerCollisions(caveLayer, [
        { entity: this.player },
        { entity: skeletons },
        { entity: zombies },
        {
          entity: spells,
          callback: this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
      ]);
    }

    // Spike
    if (spikeLayer) {
      collision.registerLayerCollisions(spikeLayer, [
        { entity: this.player, callback: this.handleSpikeHit },
        { entity: skeletons },
        { entity: zombies },
        {
          entity: spells,
          callback: this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
      ]);
    }

    // Spear
    if (spearLayer) {
      collision.registerLayerCollisions(spearLayer, [
        {
          entity: this.player,
          callback: this.handleSpearHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          type: 'overlap',
        },
        {
          entity: skeletons,
          callback: this.handleSpearHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          type: 'overlap',
        },
        {
          entity: zombies,
          callback: this.handleSpearHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          type: 'overlap',
        },
      ]);
    }

    // Platform
    if (platformLayer) {
      collision.registerLayerCollisions(platformLayer, [
        { entity: this.player },
        { entity: skeletons },
        { entity: zombies },
        { entity: boss },
        {
          entity: spells,
          callback: this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        },
      ]);
    }

    // Collide
    if (collideLayer) {
      [skeletons, zombies].forEach((entity) => {
        this.physics.add.collider(
          entity,
          collideLayer,
          this.handleEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          undefined,
          this
        );
      });
    }

    // Spells
    [this.player, skeletons, zombies, boss].forEach((entity) => {
      this.physics.add.overlap(
        spells,
        entity,
        this.handleSpellHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
    });

    // For better collisions
    this.physics.world.setFPS(120);
  }

  private createItems(): void {
    const loot = ServiceLocator.resolve(ServiceKeys.lootSystem);
    loot.setCollideLayersAndItemsOverlap();

    loot.spawnCoins(this.coinSpawnPositions);
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
}
