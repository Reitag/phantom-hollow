import Phaser from 'phaser';

import { WORLD_BOUND, DEPTH } from '@/utils/constants';
import { Player } from '@/objects/characters/player/player';
//import { Enemy } from '../objects/characters/enemies/enemy.js';
import { InputHandler } from '@/components/input/handlers/input-handler';
import { Tilemap } from '@/components/map/tilemap';
import { SpellFactory } from '@/factories/spell-factory';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { UiScene } from './ui-scene';

export class LevelOneScene extends Phaser.Scene {
  private spellFactory!: SpellFactory;
  private spellManager!: SpellManager;
  private uiManager!: UiManager;
  private player!: Player;
  private mount!: Phaser.GameObjects.TileSprite;
  private grass!: Phaser.GameObjects.TileSprite;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private inputHandler!: InputHandler;
  private map!: Tilemap;
  private canTakeSpikeDamage = true;
  private isGameInitialized = false;

  //private enemies = [];
  //private fireballs = [];
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
    this.inputHandler.update();

    /*this.enemies.children.each((enemy) => {
      enemy.update();
    }, this);*/

    this.mount.tilePositionX = this.camera.scrollX * 0.2;
    this.grass.tilePositionX = this.camera.scrollX * 0.5;
  }

  private initUiScene(callback: () => void): void {
    this.scene.launch('UiScene');
    this.scene.bringToTop('UiScene');

    const uiScene = this.scene.get('UiScene');

    uiScene.events.once(Phaser.Scenes.Events.CREATE, () => {
      if (uiScene instanceof UiScene) {
        this.uiManager = uiScene.getUI();
        callback();
      } else {
        console.error('UiScene not found or not an instance of UiScene!');
      }
    });
  }

  private createGameWorld(): void {
    this.initSpellFactory();
    this.initSpellManager();

    this.createPlayerAndSetToSpellManager();
    this.initInputHandler();

    this.createParallaxBackground();
    this.createTilemap();
    this.createWorldBounds();

    this.registerCollisions();
    this.setupCamera();
  }

  private initSpellFactory(): void {
    this.spellFactory = new SpellFactory(this);
  }

  private initSpellManager(): void {
    this.spellManager = new SpellManager(this, this.spellFactory, this.uiManager);
  }

  private createPlayerAndSetToSpellManager(): void {
    this.player = new Player({
      scene: this,
      position: { x: 50, y: 450 },
      keyName: 'player',
      health: 100,
      frame: 0,
      facingRight: true,
      spellManager: this.spellManager,
      ui: this.uiManager,
    }).setDepth(DEPTH.PLAYER);

    this.spellManager.setPlayer(this.player);
  }

  private initInputHandler(): void {
    this.inputHandler = new InputHandler(this, this.player, this.spellManager, this.uiManager);
  }

  private createParallaxBackground(): void {
    this.add.image(0, 0, 'sky').setOrigin(0);

    this.mount = this.add
      .tileSprite(0, 310, WORLD_BOUND.WIDTH, 338, 'mount')
      .setOrigin(0)
      .setScrollFactor(0);

    this.grass = this.add
      //.tileSprite(0, 490, WORLD_BOUND.WIDTH, 114, "grass")
      .tileSprite(0, 450, WORLD_BOUND.WIDTH, 114, 'grass')
      .setOrigin(0)
      .setScrollFactor(0);
  }

  private createTilemap(): void {
    const mapKey = 'level-1';
    const tilesetsConfig = [
      { name: 'ancient-tile', key: 'ancient-tiles' },
      { name: 'ground-tile', key: 'ground' },
      { name: 'cliff-tile', key: 'cliff' },
      { name: 'grass-tile', key: 'grass-2' },
    ];
    const tileLayersConfig = [
      {
        name: 'bush-layer',
        tilesets: ['grass-tile'],
        x: 0,
        y: 0,
        collide: false,
      },
      {
        name: 'ground-layer',
        tilesets: ['ground-tile', 'cliff-tile'],
        x: 0,
        y: 0,
        collide: true,
      },
      {
        name: 'spike-layer',
        tilesets: ['ground-tile'],
        x: 0,
        y: 0,
        collide: true,
      },
      {
        name: 'platform-layer',
        tilesets: ['ancient-tile'],
        x: 0,
        y: 0,
        collide: true,
      },
    ];
    const objectLayersConfig = [
      {
        name: 'tree-normal-layer',
        render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
          const name = obj.name;
          if (!name) {
            console.warn('Object missing name for tree-layer:', obj);
            return;
          }

          const image = this.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
          image.setDepth(depth);
        },
      },
      {
        name: 'tree-shadow-layer',
        render: (obj: Phaser.Types.Tilemaps.TiledObject, depth: number) => {
          const name = obj.name;
          if (!name) {
            console.warn('Object missing name for tree-layer:', obj);
            return;
          }

          const image = this.add.image(obj.x ?? 0, obj.y ?? 0, name).setOrigin(0, 1);
          image.setDepth(depth);
        },
      },
    ];
    const layerDepths = {
      'platform-layer': DEPTH.PLATFORMS,
      'spike-layer': DEPTH.SPIKE,
      'ground-layer': DEPTH.GROUND,
      'tree-normal-layer': DEPTH.TREES_NORMAL,
      'tree-shadow-layer': DEPTH.TREES_SHADOW,
      'bush-layer': DEPTH.BUSH,
    };

    this.map = new Tilemap(
      this,
      mapKey,
      tilesetsConfig,
      tileLayersConfig,
      objectLayersConfig,
      layerDepths
    ).create();
  }

  private createWorldBounds(): void {
    this.physics.world.setBounds(0, 0, WORLD_BOUND.WIDTH, WORLD_BOUND.HEIGHT);
  }

  /*createEnemies() {
    const step = 550;
    let xCoord = 450;

    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy({
        scene: this,
        position: { x: xCoord, y: 550 },
        keyName: 'skeleton-warrior',
        health: 200,
        frame: 0,
        facingRight: false,
      }).setDepth(DEPTH.ENEMY);

      this.enemies.add(enemy);
      xCoord += step;
    }
  }*/

  private registerCollisions(): void {
    const platformLayer = this.map.getTileLayer('platform-layer');
    const spikeLayer = this.map.getTileLayer('spike-layer');
    const groundLayer = this.map.getTileLayer('ground-layer');

    // Player
    if (groundLayer) {
      this.physics.add.collider(this.player, groundLayer); // ground
    }

    if (spikeLayer) {
      this.physics.add.collider(this.player, spikeLayer, this.handleSpikeHit, undefined, this); // spike
    }

    if (platformLayer) {
      this.physics.add.collider(this.player, platformLayer); // platform
    }

    // Enemy
    /*this.physics.add.collider(this.enemies, this.mapTile.groundLayer); // ground
    this.physics.add.collider(this.enemies, this.mapTile.platformLayer); // platgorm
    this.physics.add.overlap(
      this.spellFactory.getSpells(),
      this.enemies,
      this.handleFireballHit,
      null,
      this
    );
    this.enemies.children.iterate((enemy) => {
      this.physics.add.overlap(
        enemy.visionRange,
        this.player,
        () => {
          enemy.startChase(this.player);
        },
        null,
        this
      );
    });
    this.enemies.children.iterate((enemy) => {
      this.physics.add.overlap(
        enemy,
        this.player,
        () => {
          enemy.attackPlayer();
        },
        null,
        this
      );
    });*/

    // For better collisions
    this.physics.world.setFPS(120);
  }

  /*handleFireballHit(fireball, enemy) {
    fireball.destroyFireBall();
    enemy.takeDamage(fireball.damage, this.player);
  }*/

  private handleSpikeHit(): void {
    if (!this.canTakeSpikeDamage) return;

    this.player.takeDamage(25);
    this.canTakeSpikeDamage = false;

    this.time.delayedCall(500, () => {
      this.canTakeSpikeDamage = true;
    });
  }

  private setupCamera(): void {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.camera.setBounds(0, 0, WORLD_BOUND.WIDTH, WORLD_BOUND.HEIGHT);
  }
}
