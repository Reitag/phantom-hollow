import Phaser from 'phaser';

import { WORLD_PARAMS } from '@/constants/world-params';
import {
  SPEAR_HIT,
  SPIKE_HIT,
  PLAYER_STATS,
  SKELETON_WARRIOR_STATS,
  ZOMBIE_STATS,
} from '@/constants/object-stats';
import { Z_POSITION } from '@/constants/z-position';
import { CHARACTERS, TILESETS } from '@/constants/asset-keys';
import { Player } from '@/objects/characters/player/player';
import { AiSkeletonWarrior } from '@/components/ai/enemies/ai-skeleton-warrior';
import { AiZombie } from '@/components/ai/enemies/ai-zombie';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Zombie } from '@/objects/characters/enemies/zombie';
import { Tilemap } from '@/components/map/tilemap';
import { TILELAYER_NAMES, createTilemapOne } from '@/tilemap/tilemap-one';
import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellManager } from '@/managers/spell-manager';
import { Sandbox } from '@/components/sandbox/sandbox';
import { CooldownsState } from '@/components/states/ui/cooldowns-state';
import { Character } from '@/objects/core/character';
import { Spell } from '@/objects/core/spell';
import { FireBall } from '@/objects/spells/direct-spells/fire-ball';
import { Wind } from '@/objects/spells/direct-spells/wind';
import { isValidTeleportPosition } from '@/utils/helpers';
// @ts-expect-error JS import
import { MemoryMonitor } from '@/debug/memory-monitor.js';
import { UiScene } from './ui-scene';

export class LevelOneScene extends Phaser.Scene {
  private readonly playerSpawnPosition = 50;
  //private readonly playerSpawnPosition = 10300;
  private readonly skeletonSpawnPositions = [700, 1600, 2500, 4100, 4600, 6500, 8600, 10800];
  private readonly zombieSpawnPositions = [4700, 5000, 5500, 6400, 7700, 8700, 8800, 10900];

  private player!: Player;
  private aiSkeletonWarrior!: AiSkeletonWarrior;
  private aiZombie!: AiZombie;
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

  update(): void {
    this.player.update();
    this.aiSkeletonWarrior.update();
    this.aiZombie.update();

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

    this.createSpellSystems();
    this.createPlayer();

    this.createSkeletonWarriors();
    this.createZombies();

    this.registerCollisions();
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

  private createTilemap(): void {
    this.map = createTilemapOne(this);
  }

  private createWorldBounds(): void {
    this.physics.world.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private createSpellSystems(): void {
    ServiceLocator.register(ServiceKeys.cooldowns, new CooldownsState(this));
    ServiceLocator.register(ServiceKeys.spellFactory, new SpellFactory(this));
    ServiceLocator.register(ServiceKeys.sandbox, new Sandbox());
    ServiceLocator.register(ServiceKeys.spellManager, new SpellManager());
  }

  private createPlayer(): void {
    this.player = new Player({
      scene: this,
      position: { x: this.playerSpawnPosition, y: 450 },
      keyName: CHARACTERS.PLAYER,
      health: PLAYER_STATS.HEALTH,
      frame: 0,
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
        health: SKELETON_WARRIOR_STATS.HEALTH,
        frame: 0,
        facingRight: false,
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
        health: ZOMBIE_STATS.HEALTH,
        frame: 0,
        facingRight: false,
      });

      zombie.setDepth(Z_POSITION.ENEMY);
      this.aiZombie.addEnemy(zombie);
    });
  }

  private registerCollisions(): void {
    const platformLayer = this.map.getTileLayer(TILELAYER_NAMES.PLATFORM);
    const spikeLayer = this.map.getTileLayer(TILELAYER_NAMES.SPIKE);
    const groundLayer = this.map.getTileLayer(TILELAYER_NAMES.GROUND);
    const spearLayer = this.map.getTileLayer(TILELAYER_NAMES.SPEAR);
    const collideLayer = this.map.getTileLayer(TILELAYER_NAMES.COLLIDE);

    const skeletons = this.aiSkeletonWarrior.getEnemies();
    const zombies = this.aiZombie.getEnemies();
    const spells = ServiceLocator.resolve(ServiceKeys.spellFactory).getSpells();

    // Ground
    if (groundLayer) {
      this.physics.add.collider(this.player, groundLayer); // Player
      this.physics.add.collider(skeletons, groundLayer); // Skeleton warrior
      this.physics.add.collider(zombies, groundLayer); // Zombie
      this.physics.add.collider(
        spells,
        groundLayer,
        this.handleSpellCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      ); // Spells
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

    // Fireball
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
    if (spell instanceof Spell && spell.hasAlreadyHit(victim)) return;

    (spell as Spell).registerHit(victim);

    const tolerance = 10;
    if (Math.abs(victim.y - (spell as Spell).y) > tolerance) return;

    if (spell instanceof FireBall) {
      victim.takeDamage(spell.causeDamage());
      spell.destroySpell();
    } else if (spell instanceof Wind) {
      const direction = victim.getArcadeBody().x > spell.getArcadeBody().x ? -1 : 1;
      const movement = victim.getMovement();
      movement.applyForce(-200);
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
