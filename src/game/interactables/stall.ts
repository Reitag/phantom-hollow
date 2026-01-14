import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Store } from '@/components/ui/store/store';
import { STORE_TOOLTIP } from '@/constants/tooltip-params';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Stall extends Interactable {
  private store: Store;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames.stall);

    this.store = ServiceLocator.resolve(ServiceKeys.ui).getStore();
  }

  protected onEnter(): void {
    this.store.registerStoreEvents();
    this.ui.showHorizontalTooltip(
      {
        x: this.scene.scale.width / 2 - 60,
        y: this.player.y - 40,
        width: 170,
        fillColor: 0x000000,
      },
      STORE_TOOLTIP
    );
  }
  protected onInteract(): void {
    if (!this.store.isOpen) {
      this.store.scene.events.emit('open-store');
      this.ui.hideTooltip();
    }
  }
  protected onLeave(): void {
    if (this.store.isOpen) {
      this.store.scene.events.emit('close-store');
    }
    this.store.unregisterStoreEvents();
    this.ui.hideTooltip();
  }
}
