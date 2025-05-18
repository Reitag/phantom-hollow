import Phaser from "phaser";

import { WORLD_BOUND } from "../config/constants.js";
import { Player } from "../objects/characters/player.js";
import { StaticObject } from '../objects/static/static-object.js';
import { Enemy } from "../objects/characters/enemy.js";
import { InputController } from "../components/input-controller.js";
import { SpellFactory } from "../factories/spell-factory.js";

export class LevelOneScene extends Phaser.Scene {
  #platforms = [];

  constructor() {
    super('LevelOneScene');

    this.spellFactory = null; // spell factory

    this.player = null;
    this.mount = null;
    this.grass = null;
    this.camera = null;
    this.portal = null;
    this.enemies = [];
    this.fireballs = [];
    this.inputController = null;

    this.mapTile = {
      map: null,
      ground: {
        groundTiles: null,
        groundLayer: null,
      }
    }
  }

  create() {
    this.physics.world.createDebugGraphic();
    this.spellFactory = new SpellFactory(this);

    this.enemies = this.physics.add.group();
  
    this.inputController = new InputController(this, this.spellFactory);

    this.createParallaxBackground();
    this.createTilemap();
    this.createWorldBounds();
    this.createPlatforms();
    this.createPlayer();
    this.createEnemies(); // enemies
    this.createCollisions();
    this.setupCamera();

    this.portal = this.add.sprite(500, 557, 'portal');
    
    this.portal.anims.play('portal-spin');

    this.scene.launch('UiScene');
    this.scene.bringToTop('UiScene');
  }

  update() {
    this.player.update();

    if (this.player) {
      this.inputController.update(this.player);
    }

    this.enemies.children.each((enemy) => {
      enemy.update();
    }, this);

    this.mount.tilePositionX = this.camera.scrollX * 0.2;
    this.grass.tilePositionX = this.camera.scrollX * 0.5;
  }

  createParallaxBackground() {
    this.add.image(0, 0, 'sky').setOrigin(0);

    this.mount = this.add.tileSprite(0, 310, WORLD_BOUND.WIDTH, 338, 'mount')
      .setOrigin(0)
      .setScrollFactor(0);

    this.grass = this.add.tileSprite(0, 490, WORLD_BOUND.WIDTH, 114, 'grass')
      .setOrigin(0)
      .setScrollFactor(0);
  }

  createTilemap() {
    const map = this.make.tilemap({ key: 'level-0' });
    const groundTiles = map.addTilesetImage('ground-collide', 'ground');
    const groundLayer = map.createLayer('ground-layer', groundTiles, 0, 0);
    groundLayer.setCollisionByProperty({ collides: true });

    this.mapTile.map = map
    this.mapTile.ground.groundTiles = groundTiles;
    this.mapTile.ground.groundLayer = groundLayer;
  }

  createWorldBounds() {
    this.physics.world.setBounds(0, 0, WORLD_BOUND.WIDTH, WORLD_BOUND.HEIGHT);
  }

  createPlatforms() {
    this.#platforms = new StaticObject({
      scene: this,
      objects: [
        { objectName: 'plat', position: { x: 950, y: 530 } },
        { objectName: 'plat', position: { x: 600, y: 500 } },
        { objectName: 'plat', position: { x: 1400, y: 500 } },
        { objectName: 'plat', position: { x: 1500, y: 450 } },
        { objectName: 'plat', position: { x: 1540, y: 390 } },
        { objectName: 'plat', position: { x: 1480, y: 330 } },
        { objectName: 'plat', position: { x: 1510, y: 200 } },
      ]
    });
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      position: { x: 200, y: 500 },
      keyName: 'player',
      health: 100,
      frame: 0,
      facingRight: true,
      spellFactory: this.spellFactory
    });
  }

  createEnemies() {
    const enemy = new Enemy({
      scene: this,
      position: { x: 450, y: 550 },
      keyName: 'skeleton-warrior',
      health: 200,
      frame: 0,
      facingRight: false
    });

    this.enemies.add(enemy);
  }

  createCollisions() {
    this.physics.add.collider(this.player, this.mapTile.ground.groundLayer);
    this.physics.add.collider(this.player, this.#platforms);
    this.physics.add.collider(this.enemies, this.mapTile.ground.groundLayer);
    this.physics.add.overlap(this.spellFactory.getSpells(), this.enemies, this.handleFireballHit, null, this);
    this.enemies.children.iterate(enemy => {
      this.physics.add.overlap(enemy.visionRange, this.player, () => {
        enemy.startChase(this.player);
      }, null, this);
    });
    this.enemies.children.iterate(enemy => {
      this.physics.add.overlap(enemy, this.player, () => {
        enemy.attackPlayer();
      }, null, this);
    });

    // For better collisions
    this.physics.world.setFPS(120);
  }

  handleFireballHit(fireball, enemy) {
    fireball.destroyFireBall();
    enemy.takeDamage(fireball.damage, this.player);
  }

  setupCamera() {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.camera.setBounds(0, 0, WORLD_BOUND.WIDTH, WORLD_BOUND.HEIGHT);
  }
}
