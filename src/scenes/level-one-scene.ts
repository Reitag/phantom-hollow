import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { WORLD_PARAMS } from '@/constants/world-params';
import { ARROW_STATS, SPEAR_HIT, SPIKE_HIT } from '@/constants/object-stats';
import { Item } from '@/base/objects/item';
import { BACKGROUNDS, MISC } from '@/constants/asset-keys';
import { SCENE_SIZE } from '@/constants/scene-size';
import { LIGHTNING_SHIELD } from '@/constants/modifier-stats';
import { Player } from '@/entities/characters/player/player';
import { Tilemap } from '@/components/map/tilemap';
import { TILELAYER_NAMES, createTilemapOne } from '@/tilemap/tilemap-one';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Stall } from '@/game/interactables/stall';
import { SoulPedestal } from '@/game/interactables/soul-pedestal';
import { AlchemistQuestTrigger } from '@/game/interactables/alchemist-quest-trigger';
import { LootZone } from '@/game/interactables/loot-zone';
import { CrystalShrine } from '@/game/interactables/crystal-shrine';
import { GreetingLetter } from '@/game/interactables/greeting-letter';
import { InventorySystem } from '@/systems/inventory-system';
import { Arrow } from '@/entities/weapons/arrow';
import { BonFire } from '@/entities/misc/bonfire';
import { QuestMark } from '@/entities/misc/quest-mark';
import { SpellFactory } from '@/factories/spell-factory';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { InteractableKeeper } from '@/systems/interactable-keeper';
import { LootSystem } from '@/systems/loot-system';
import { Coin } from '@/entities/items/coin';
import { LightningShield } from '@/entities/spells/effect-spells/lightning-shield';
import { ShadowTrail } from '@/entities/spells/direct-spells/shadow-trail';
import { EnemySpawn } from '@/systems/enemy-spawn';
import { NPCSpawn } from '@/systems/npc-spawn';
import { PlayerHandler } from '@/systems/player-handler';
import { SpellSystem } from '@/systems/spell-system';
import { Sandbox } from '@/infrastructure/sandbox';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { Spell } from '@/base/objects/spell';
import { Position, SaveGame } from '@/utils/types';
import { UiScene } from './ui-scene';
// @ts-expect-error JS import
import { DebugScreen } from '../../tools/debug-screen.js';

export class LevelOneScene extends Phaser.Scene {
  private debugScreen: DebugScreen | null = null;

  private player!: Player;
  private playerHandler!: PlayerHandler;
  private spawn!: EnemySpawn;
  private interactables!: InteractableKeeper;
  private mount!: Phaser.GameObjects.TileSprite;
  private forest!: Phaser.GameObjects.TileSprite;
  private sky!: Phaser.GameObjects.TileSprite;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private map!: Tilemap;
  private npc!: NPCSpawn;
  private questMark!: QuestMark;
  private canPlayerGetDamage = true;
  private isLevelInitialized = false;

  constructor() {
    super('LevelOneScene');
  }

  public get quest(): QuestMark {
    return this.questMark;
  }

  public create(save: SaveGame | undefined): void {
    if (save && Object.keys(save).length === 0) {
      save = undefined;
    }

    if (this.isLevelInitialized) return;
    this.isLevelInitialized = true;

    SaveService.start();
    ServiceLocator.register(ServiceKeys.save, save);

    if (!save?.scene) {
      SaveService.patch({
        scene: this.scene.key,
      });
    }

    this.initKeyboard();
    this.initUiScene(() => this.createGameWorld());

    // Clean Up
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanup();
    });
  }

  public update(time: number, delta: number): void {
    this.playerHandler.update(delta);
    this.spawn.update(time, delta);
    this.npc.update();
    this.interactables.update(delta);

    this.updateParallaxBackground();

    // Debug
    if (this.debugScreen && this.debugScreen instanceof DebugScreen) {
      this.debugScreen.setPlayersCoords(this.player.x, this.player.y);
    }
    // Debug
  }

  private initKeyboard(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input not available yet.');
    }

    ServiceLocator.register(ServiceKeys.input, new KeyboardController(keyboard));
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
          this.scene.add('DebugScreen', DebugScreen, true);
          this.debugScreen = this.scene.get('DebugScreen');
          // Debug graphic
          this.physics.world.createDebugGraphic();
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
    this.createMiscs();
    this.createInteractableObjects();

    this.registerCollisions();
    this.createSpawnSystems();

    this.setupCamera();
  }

  /*private createParallaxBackground(): void {
    this.sky = this.add
      .tileSprite(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT, BACKGROUNDS.SKY_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.mount = this.add
      .tileSprite(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT, BACKGROUNDS.MOUNT_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.forest = this.add
      .tileSprite(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT, BACKGROUNDS.FOREST_BG)
      .setOrigin(0)
      .setScrollFactor(0);
  }*/
  private createParallaxBackground(): void {
    this.sky = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.SKY_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.mount = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.MOUNT_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.forest = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.FOREST_BG)
      .setOrigin(0)
      .setScrollFactor(0);
  }

  private updateParallaxBackground(): void {
    this.mount.tilePositionX = this.camera.scrollX * 0.2;
    this.forest.tilePositionX = this.camera.scrollX * 0.5;
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

    CollisionService.registerGroup(
      GroupKeys.npc,
      this.physics.add.group({
        allowGravity: true,
      })
    );
  }

  private createWorldBounds(): void {
    this.physics.world.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private registerSystems(): void {
    ServiceLocator.register(ServiceKeys.map, this.map);
    ServiceLocator.register(ServiceKeys.cooldowns, new SpellCooldowns(this));
    ServiceLocator.register(ServiceKeys.spellFactory, new SpellFactory(this));
    ServiceLocator.register(ServiceKeys.sandbox, new Sandbox());
    ServiceLocator.register(ServiceKeys.spellSystem, new SpellSystem());
    ServiceLocator.register(ServiceKeys.inventorySystem, new InventorySystem());
    ServiceLocator.register(ServiceKeys.lootSystem, new LootSystem(this));
    ServiceLocator.register(ServiceKeys.collision, new CollisionService());
  }

  // --- Player ---
  private createPlayer(): void {
    this.playerHandler = new PlayerHandler(this);
    this.player = this.playerHandler.getPlayer();

    const save = ServiceLocator.resolve(ServiceKeys.save);

    if (save) {
      this.player.getCoinKeeper().addCoins(save.coins, false);
      this.uploadInventory(save);
    }
  }

  private uploadInventory(save: SaveGame): void {
    if (save.inventory.length > 0) {
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      inventory.loadDataSlots(
        save.inventory.map((slot) => {
          return slot ? { item: LOOT_FACTORY[slot.id](), quantity: slot.quantity } : null;
        })
      );
    }
  }
  // --- Player ---

  private createInteractableObjects(): void {
    this.interactables = new InteractableKeeper();

    this.interactables.add(new Stall(this));
    this.interactables.add(new SoulPedestal(this));
    this.interactables.add(new AlchemistQuestTrigger(this));
    this.interactables.add(new LootZone(this));
    this.interactables.add(new CrystalShrine(this));
    this.interactables.add(new GreetingLetter(this));
  }

  private registerCollisions(): void {
    const enemies = CollisionService.resolveGroup(GroupKeys.enemy);
    const npc = CollisionService.resolveGroup(GroupKeys.npc);
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
        { entity: npc },
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

  private createSpawnSystems(): void {
    this.spawn = new EnemySpawn(this);
    this.npc = new NPCSpawn(this);
  }

  private createMiscs(): void {
    const result: Record<string, Position> = {};
    const map = ServiceLocator.resolve(ServiceKeys.map);
    const objectLayer = map.getObjectLayer('spawn-layer');
    if (!objectLayer) throw new Error('Spawn-layer does not resolved');

    for (const obj of objectLayer.objects) {
      if (obj.name !== 'misc-spawn') continue;

      const miscType = obj.properties.find(
        (p: { name: string; type: string; value: string }) => p.name === 'misc'
      )?.value;

      if (!miscType) continue;
      if (!obj.x || !obj.y) continue;
      result[miscType] = {
        x: obj.x,
        y: obj.y,
      };
    }

    new BonFire({
      scene: this,
      position: { x: result['bonfire'].x, y: result['bonfire'].y },
      keyName: MISC.BON_FIRE,
      frame: 0,
    });

    this.questMark = new QuestMark({
      scene: this,
      position: { x: result['quest-mark'].x, y: result['quest-mark'].y },
      keyName: MISC.QUEST_MARK,
      frame: 0,
    });
  }

  private setupCamera(): void {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.camera.setBounds(0, 0, WORLD_PARAMS.WIDTH, WORLD_PARAMS.HEIGHT);
  }

  private handleEnemyCollision(
    enemy: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ): void {
    if (!(enemy instanceof Character)) return;

    const collision = ServiceLocator.resolve(ServiceKeys.collision);
    if (collision.isEntityColliding(enemy)) {
      // No code here, using as 'placeholder' for some possible future cases
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
    // For nature shield and shadow trail
    if (spell instanceof LightningShield || spell instanceof ShadowTrail) {
      spell.applyEffect(victim);
      return;
    }

    if (spell.causeDamage() > 0) {
      victim.takeDamage(spell.causeDamage(), spell.getCaster());
      spell.destroySpell();
    }

    const modifier = victim.getModifier();

    if (modifier.isModifierExist(LIGHTNING_SHIELD.id)) return;

    spell.applyEffect(victim);
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
      target.takeDamage(ARROW_STATS.HIT);
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

  public onFireWormDied(data: { x: number; y: number }): void {
    const lootZone = this.interactables.get(LootZone);
    const zone = this.add.zone(data.x - 14, data.y + 14, 32, 32).setOrigin(0, 0);

    const dropId = crypto.randomUUID();

    SaveService.patch({
      worldState: {
        ...SaveService.data.worldState,
        droppedLoot: [
          ...SaveService.data.worldState.droppedLoot,
          {
            id: dropId,
            x: data.x,
            y: data.y,
            loot: [{ id: 'fireworm-fang', amount: 1 }],
          },
        ],
      },
    });

    lootZone?.createLootZone(dropId, zone, [{ id: 'fireworm-fang', amount: 1 }]);
  }

  private cleanup(): void {
    // Debug
    if (this.debugScreen && this.debugScreen instanceof DebugScreen) {
      this.debugScreen.scene.stop();
      this.debugScreen.scene.remove('DebugScreen');
      this.debugScreen = null;
    }
    // Debug

    this.time.removeAllEvents();
    this.isLevelInitialized = false;

    this.events.off('fire-worm:died');
    this.events.off('fireworm-fang:looted');

    CollisionService.clear();
    SaveService.clear();
    ServiceLocator.clear();
  }
}
