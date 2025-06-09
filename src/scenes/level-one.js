import Phaser from "phaser";

import { WORLD_BOUND, DEPTH } from "../config/constants.js";
import { Player } from "../objects/characters/player.js";
import { StaticObject } from "../objects/static/static-object.js";
import { Enemy } from "../objects/characters/enemy.js";
import { InputController } from "../components/input-controller.js";
import { Tilemap } from "../components/tilemap.js";
import { SpellFactory } from "../factories/spell-factory.js";

export class LevelOneScene extends Phaser.Scene {
  constructor() {
    super("LevelOneScene");

    this.spellFactory = null; // spell factory

    this.player = null;
    this.mount = null;
    this.grass = null;
    this.camera = null;
    this.portal = null;
    this.enemies = [];
    this.fireballs = [];
    this.platforms = [];
    this.inputController = null;

    this.mapTile = {
      map: null,
      platformLayer: null,
      groundLayer: null,
      treesLayer: null,
      bushLayer: null,
    };
  }

  create() {
    this.physics.world.createDebugGraphic();
    this.spellFactory = new SpellFactory(this);

    this.enemies = this.physics.add.group();

    this.inputController = new InputController(this, this.spellFactory);

    this.createParallaxBackground();
    this.createTilemap();
    this.createWorldBounds();
    //this.createPlatforms();
    this.createPlayer();
    this.createEnemies(); // enemies
    this.createCollisions();
    this.setupCamera();

    this.portal = this.add.sprite(500, 557, "portal");

    this.portal.anims.play("portal-spin").setDepth(DEPTH.PORTAL);

    this.scene.launch("UiScene");
    this.scene.bringToTop("UiScene");
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

    this.spellFactory.getSpells().setDepth(DEPTH.SPELL);
  }

  createParallaxBackground() {
    this.add.image(0, 0, "sky").setOrigin(0);

    this.mount = this.add
      .tileSprite(0, 310, WORLD_BOUND.WIDTH, 338, "mount")
      .setOrigin(0)
      .setScrollFactor(0);

    this.grass = this.add
      .tileSprite(0, 490, WORLD_BOUND.WIDTH, 114, "grass")
      .setOrigin(0)
      .setScrollFactor(0);
  }

  createTilemap() {
    // somewhere in your Scene.create():
    this.mapTile.map = new Tilemap(
      this,
      // 1) The Tiled map key
      "level-1",

      // 2) tilesetsConfig: name must match the tileset.name in your .tmj,
      //    key must match what you preloaded in JSON
      [
        { name: "platform-blocks-tile", key: "platform-blocks" }, // Tiled: ground-collide tileset
        { name: "ground-collide", key: "ground" }, // Tiled: ground-collide tileset
        { name: "bush-tile", key: "bush-green" }, // Tiled: bush-tile image collection
        { name: "ancient-tile", key: "ancient-tiles" }, // Tiled: tree-dark-tile
      ],

      // 3) layersConfig: must match your layer names in Tiled
      [
        {
          name: "ancient-build-dark-layer",
          tilesets: ["ancient-tile"],
          x: 0,
          y: 0,
          collide: false,
        },
        {
          name: "ancient-builds-layer",
          tilesets: ["ancient-tile"],
          x: 0,
          y: 0,
          collide: false,
        },
        {
          name: "ancient-plants-layer",
          tilesets: ["ancient-tile"],
          x: 0,
          y: 0,
          collide: false,
        },
        {
          name: "bush-layer",
          tilesets: ["bush-tile"],
          x: 0,
          y: 0,
          collide: false,
        },
        {
          name: "ground-layer",
          tilesets: ["ground-collide"],
          x: 0,
          y: 0,
          collide: true,
        },
        {
          name: "platform-layer",
          tilesets: ["platform-blocks-tile"],
          x: 0,
          y: 0,
          collide: true,
        },
      ],

      // 4) objectLayerConfig
      [
        {
          name: "tree-normal-layer",
          render: function (obj, depth) {
            const image = this.add
              .image(obj.x, obj.y, "tree-normal")
              .setOrigin(0, 1);
            image.setDepth(depth);
          },
        },
        {
          name: "tree-dark-layer",
          render: function (obj, depth) {
            const image = this.add
              .image(obj.x, obj.y, "tree-dark")
              .setOrigin(0, 1);
            image.setDepth(depth);
          },
        },
      ],

      // 5) layers
      {
        "platform-layer": DEPTH.PLATFORMS,
        "ground-layer": DEPTH.GROUND,
        "bush-layer": DEPTH.BUSH,
        "tree-normal-layer": DEPTH.TREES_NORMAL,
        "ancient-plants-layer": DEPTH.ANCIENT_PLANTS,
        "ancient-builds-layer": DEPTH.ANCIENT_NORMAL,
        "ancient-build-dark-layer": DEPTH.ANCIENT_DARK,
        "tree-dark-layer": DEPTH.TREES_DARK,
      }
    ).create();

    // Example: access the ground layer
    this.mapTile.groundLayer = this.mapTile.map.getTileLayer("ground-layer");
    this.mapTile.platformLayer =
      this.mapTile.map.getTileLayer("platform-layer");
  }

  createWorldBounds() {
    this.physics.world.setBounds(0, 0, WORLD_BOUND.WIDTH, WORLD_BOUND.HEIGHT);
  }

  createPlatforms() {
    this.platforms = new StaticObject({
      scene: this,
      objects: [
        { objectName: "plat", position: { x: 200, y: 500 } },
        { objectName: "plat", position: { x: 600, y: 500 } },
        { objectName: "plat", position: { x: 1400, y: 500 } },
        { objectName: "plat", position: { x: 1560, y: 430 } },
        { objectName: "plat", position: { x: 1550, y: 360 } },
        { objectName: "plat", position: { x: 1480, y: 290 } },
        { objectName: "plat", position: { x: 1510, y: 220 } },
      ],
    }).setDepth(DEPTH.PLATFORMS);
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      position: { x: 200, y: 500 },
      keyName: "player",
      health: 100,
      frame: 0,
      facingRight: true,
      spellFactory: this.spellFactory,
    }).setDepth(DEPTH.PLAYER);
  }

  createEnemies() {
    const step = 550;
    let xCoord = 450;

    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy({
        scene: this,
        position: { x: xCoord, y: 550 },
        keyName: "skeleton-warrior",
        health: 200,
        frame: 0,
        facingRight: false,
      }).setDepth(DEPTH.ENEMY);

      this.enemies.add(enemy);
      xCoord += step;
    }
  }

  createCollisions() {
    this.physics.add.collider(this.player, this.mapTile.groundLayer); // ground
    this.physics.add.collider(this.player, this.mapTile.platformLayer); // platform
    //this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.mapTile.groundLayer); // ground
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
