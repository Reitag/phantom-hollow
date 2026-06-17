import { BaseScene } from '@/base/scene/base-scene';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { WORLD_PARAMS } from '@/constants/world-params';
import { ARROW_STATS, SPEAR_HIT, SPIKE_HIT } from '@/constants/object-stats';
import { Item } from '@/base/objects/item';
import { AUDIO, BACKGROUNDS, MISC } from '@/constants/asset-keys';
import { SCENE_SIZE } from '@/constants/scene-size';
import { LIGHTNING_SHIELD } from '@/constants/modifier-stats';
import { QUEST_IDS } from '@/constants/quest-ids';
import { Player } from '@/entities/characters/player/player';
import { Tilemap } from '@/components/map/tilemap';
import { SpellPower } from '@/components/stats/damage';
import { TILELAYER_NAMES, createTilemapOne } from '@/tilemap/tilemap-one';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Stall } from '@/game/interactables/stall';
import { Bonfire } from '@/game/interactables/bonfire';
import { AlchemistQuestTrigger } from '@/game/interactables/alchemist-quest-trigger';
import { CrystalShrineQuestTrigger } from '@/game/interactables/crystal-shrine-quest-trigger';
import { LootZone } from '@/game/interactables/loot-zone';
import { GreetingLetter } from '@/game/interactables/greeting-letter';
import { MainQuestTrigger } from '@/game/interactables/main-quest-trigger';
import { InventorySystem } from '@/systems/inventory-system';
import { Arrow } from '@/entities/weapons/arrow';
import { Bowler } from '@/entities/misc/bowler';
import { QuestMark } from '@/entities/misc/quest-mark';
import { SignMark } from '@/entities/misc/sign-mark';
import { SpellFactory } from '@/factories/spell-factory';
import { LOOT_FACTORY } from '@/factories/loot-factory';
import { InteractableKeeper } from '@/systems/interactable-keeper';
import { LootSystem } from '@/systems/loot-system';
import { Coin } from '@/entities/items/coin';
import { FireBall } from '@/entities/spells/direct-spells/fire-ball';
import { Shrine } from '@/entities/misc/shrine';
import { LightningShield } from '@/entities/spells/effect-spells/lightning-shield';
import { ShadowTrail } from '@/entities/spells/direct-spells/shadow-trail';
import { AudioSystem } from '@/systems/audio-system';
import { EnemySpawn } from '@/systems/enemy-spawn';
import { UiSystem } from '@/systems/ui-system';
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

type AudioZone = {
  polygon: Phaser.Geom.Polygon;
  ambient: string;
};

export class LevelOneScene extends BaseScene {
  private debugScreen: DebugScreen | null = null;

  // Background
  private sky: Phaser.GameObjects.TileSprite | null = null;
  private mountainRange: Phaser.GameObjects.TileSprite | null = null;
  private forestBack: Phaser.GameObjects.TileSprite | null = null;
  private forestFront: Phaser.GameObjects.TileSprite | null = null;

  // Ambient
  private audio: AudioSystem | null = null;
  private ambientZones: AudioZone[] = [];
  private currentAmbient: string | null = null;

  private player!: Player;
  private playerHandler!: PlayerHandler;
  private spawn!: EnemySpawn;
  private interactables!: InteractableKeeper;
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
    super.create();

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
  }

  public update(time: number, delta: number): void {
    this.playerHandler.update(delta);
    this.spawn.update(time, delta);
    this.npc.update();
    this.interactables.update(delta);

    this.updateParallaxBackground();
    this.ambientUpdate();

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
        // this.ui = uiScene.getUI();
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
    this.uploadInventory();

    this.registerCollisions();
    this.createSpawnSystems();

    this.setupCamera();

    this.createAmbientZones();
  }

  private createParallaxBackground(): void {
    this.sky = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.SKY_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.mountainRange = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.MOUNTAIN_RANGE_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.forestBack = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.FOREST_BACK_BG)
      .setOrigin(0)
      .setScrollFactor(0);

    this.forestFront = this.add
      .tileSprite(0, 0, SCENE_SIZE.WIDTH, SCENE_SIZE.HEIGHT, BACKGROUNDS.FOREST_FRONT_BG)
      .setOrigin(0)
      .setScrollFactor(0);
  }

  private updateParallaxBackground(): void {
    if (this.mountainRange && this.forestBack && this.forestFront && this.sky) {
      this.sky.tilePositionX = this.camera.scrollX * 0.1;
      this.mountainRange.tilePositionX = this.camera.scrollX * 0.2;
      this.forestBack.tilePositionX = this.camera.scrollX * 0.5;
      this.forestFront.tilePositionX = this.camera.scrollX * 0.9;
    }
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
    ServiceLocator.register(ServiceKeys.audio, new AudioSystem(this));
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
  }
  // Comes after:
  // - this.createMiscs();
  // - this.createInteractableObjects();
  private uploadInventory(): void {
    const save = ServiceLocator.resolve(ServiceKeys.save);
    if (!save) return;

    this.player.getCoinKeeper().addCoins(save.coins, false);

    if (save.inventory.length > 0) {
      const inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

      inventory.loadDataSlots(
        save.inventory.map((slot) => {
          // Need for count used crystal loot zones
          if (slot?.id === 'arcane-shard') {
            for (let i = 0; i < slot?.quantity; ++i) {
              this.events.emit('crystal-shrine:looted');
            }
          }
          return slot ? { item: LOOT_FACTORY[slot.id](), quantity: slot.quantity } : null;
        })
      );
    }
  }
  // --- Player ---

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

    new SignMark({
      scene: this,
      position: { x: result['letter-sign-mark'].x, y: result['letter-sign-mark'].y },
      keyName: MISC.SIGN_MARK,
      frame: 0,
    });

    new Bowler({
      scene: this,
      position: { x: result['bowler'].x, y: result['bowler'].y },
      keyName: MISC.BOWLER,
      frame: 0,
    });

    new Shrine({
      scene: this,
      position: { x: result['crystal-shrine'].x, y: result['crystal-shrine'].y },
      keyName: MISC.CRYSTAL_SHRINE,
      frame: 0,
    });
  }

  private createInteractableObjects(): void {
    this.interactables = new InteractableKeeper();

    this.interactables.add(new Stall(this));
    this.interactables.add(new Bonfire(this));
    this.interactables.add(new AlchemistQuestTrigger(this));
    this.interactables.add(new CrystalShrineQuestTrigger(this));
    this.interactables.add(new LootZone(this));
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
        spell.playImpactSound();
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

    const modifier = victim.getModifier();

    spell.registerHit(victim);
    // For nature shield and shadow trail
    if (spell instanceof LightningShield || spell instanceof ShadowTrail) {
      spell.applyEffect(victim);
      return;
    }

    if (spell.causeDamage() > 0) {
      const caster = spell.getCaster();
      const spellPower = caster.getStats().damage.spellPower as SpellPower;

      if (spell instanceof FireBall && spellPower.isCriticalStrike) {
        victim.takeDamage(spell.causeDamage(), caster, true);
        spell.playCritImpactSound();
      } else {
        victim.takeDamage(spell.causeDamage(), caster);
        spell.playImpactSound();
      }
      spell.destroySpell();
    }

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
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.ARROW_IMPACT);
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
      if (tile.properties.collides && !target.getDead() && this.canPlayerGetDamage) {
        target.takeDamage(SPEAR_HIT, 'spear');
        ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.SPEAR_IMPACT);

        this.canPlayerGetDamage = false;

        this.time.delayedCall(3000, () => {
          this.canPlayerGetDamage = true;
        });
      }
    }
  }

  private handlePickup(character: Phaser.GameObjects.GameObject, item: Item): void {
    if (character instanceof Player && item instanceof Coin) {
      character.getCoinKeeper().addCoins(1);
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.COIN_PICK);
    }

    item.destroy();
  }

  public onFireWormDied(data: { x: number; y: number }): void {
    this.spawnLoot('fireworm-fang-1', { x: data.x - 14, y: data.y + 14 }, [
      { id: 'fireworm-fang', amount: 1 },
    ]);
  }

  public onEvilWizardDied(pos: Position): void {
    SaveService.setQuestState(QUEST_IDS.MAIN_QUEST, 'completed');
    this.interactables.add(new MainQuestTrigger(this, pos));
  }

  public onCrystalShrineQuestStart(): void {
    const map = ServiceLocator.resolve(ServiceKeys.map);
    const objectLayer = map.getObjectLayer('spawn-layer');
    if (!objectLayer) throw new Error('Spawn-layer does not resolved');

    const crystalZones: Position[] = objectLayer.objects
      .filter((obj) => obj.name === 'interactable-spawn')
      .filter((obj) =>
        obj.properties?.some(
          (p: { name: string; value: string }) => p.name === 'trigger' && p.value === 'crystal-loot'
        )
      )
      .filter((obj) => obj.x && obj.y)
      .map((obj) => ({ x: obj.x!, y: obj.y! }));

    crystalZones.forEach((pos, index) => {
      this.spawnLoot(`crystal-${index + 1}`, pos, [{ id: 'arcane-shard', amount: 1 }]);
    });
  }

  public spawnLoot(
    dropId: string,
    position: { x: number; y: number },
    loot: { id: string; amount: number }[]
  ): void {
    const lootZone = this.interactables.get(LootZone);

    const zone = this.add.zone(position.x, position.y, 32, 32).setOrigin(0, 0);

    SaveService.patch({
      worldState: {
        ...SaveService.data.worldState,
        droppedLoot: [
          ...SaveService.data.worldState.droppedLoot,
          {
            id: dropId,
            x: position.x,
            y: position.y,
            loot,
          },
        ],
      },
    });

    lootZone?.createLootZone(dropId, zone, loot);
  }

  // Ambient
  private createAmbientZones(): void {
    this.audio = ServiceLocator.resolve(ServiceKeys.audio);

    const objectLayer = this.map.getObjectLayer('spawn-layer');
    if (!objectLayer) return;

    for (const obj of objectLayer.objects) {
      if (obj.name !== 'play-audio') continue;

      const ambient = obj.properties?.find(
        (p: { name: string; type: string; value: string }) => p.name === 'ambient'
      )?.value;
      if (!ambient || !obj.polygon) continue;

      const points = obj.polygon.map((p: Phaser.Types.Math.Vector2Like) => ({
        x: p.x + (obj.x ?? 0),
        y: p.y + (obj.y ?? 0),
      }));

      const polygon = new Phaser.Geom.Polygon(points);

      this.ambientZones.push({
        polygon,
        ambient,
      });
    }
  }

  private ambientUpdate(): void {
    const zone = this.ambientZones.find((zone) =>
      Phaser.Geom.Polygon.Contains(zone.polygon, this.player.x, this.player.y)
    );

    const ambientName = zone?.ambient ?? 'default';

    if (ambientName !== this.currentAmbient) {
      this.audio?.playAmbient(this.getAmbientKey(ambientName));
      this.currentAmbient = ambientName;
    }
  }

  private getAmbientKey(name: string): string {
    switch (name) {
      case 'cave':
        return AUDIO.CAVE_AMBIENT;
      default:
        return AUDIO.FOREST_AMBIENT;
    }
  }
  // --Ambient--

  protected cleanup(): void {
    this.audio?.stopAmbient(false);
    this.audio = null;
    this.currentAmbient = null;

    // Debug
    if (this.debugScreen && this.debugScreen instanceof DebugScreen) {
      this.debugScreen.scene.stop();
      this.debugScreen.scene.remove('DebugScreen');
      this.debugScreen = null;
    }
    // Debug

    this.time.removeAllEvents();
    this.isLevelInitialized = false;

    // Alchemist quest
    this.events.off('fire-worm:died');
    this.events.off('evil-wizard:died');
    this.events.off('fireworm-fang:looted');

    // Crystal quest
    this.events.off('crystal-shrine:looted');
    this.events.off('crystal-shrine:completed');

    CollisionService.clear();
    SaveService.clear();
    ServiceLocator.clear();
  }
}
