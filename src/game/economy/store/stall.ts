import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { Store } from '@/components/ui/store/store';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { UiScene } from '@/scenes/ui-scene';

export class Stall {
  private uiScene: Phaser.Scene;
  private store: Store;
  private storeZone: Phaser.GameObjects.Zone;
  private player: Player;
  private input: KeyboardController;
  private wasInZone = false;

  constructor(private scene: Phaser.Scene) {
    this.storeZone = this.scene.add.zone(7977, 500, 76, 100);
    this.scene.physics.world.enable(this.storeZone);
    (this.storeZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (this.storeZone.body as Phaser.Physics.Arcade.Body).setImmovable(true);

    this.player = ServiceLocator.resolve(ServiceKeys.player);
    this.input = ServiceLocator.resolve(ServiceKeys.input);
    this.uiScene = this.scene.scene.get('UiScene');

    if (this.uiScene instanceof UiScene) {
      this.store = this.uiScene.getStore();
    } else {
      throw new Error('The store did not initialized');
    }
  }

  public update() {
    const inZone = this.scene.physics.overlap(this.player, this.storeZone);

    // Player entered the zone
    if (inZone && !this.wasInZone) {
      this.store.registerStoreEvents();
      console.log('Press Q to open the store');
    }

    // Handle open
    if (inZone && this.input.isStoreTrigger && !this.store.isOpen) {
      this.uiScene.events.emit('open-store');
    }

    // Leave zone
    if (!inZone && this.wasInZone) {
      if (this.store.isOpen) {
        this.uiScene.events.emit('close-store');
      }
      this.store.unregisterStoreEvents();
    }

    this.wasInZone = inZone;
  }
}
