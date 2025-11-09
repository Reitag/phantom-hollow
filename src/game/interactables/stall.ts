import { Interactable } from '@/base/objects/interactable';
import { Store } from '@/components/ui/store/store';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Stall extends Interactable {
  private store: Store;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.store = ServiceLocator.resolve(ServiceKeys.ui).getStore();
  }

  protected onEnter(): void {
    this.store.registerStoreEvents();
    console.log('Press Q to open the store');
  }
  protected onInteract(): void {
    if (!this.store.isOpen) {
      this.store.scene.events.emit('open-store');
    }
  }
  protected onLeave(): void {
    if (this.store.isOpen) {
      this.store.scene.events.emit('close-store');
    }
    this.store.unregisterStoreEvents();
  }
}
