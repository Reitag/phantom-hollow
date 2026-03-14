import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Store } from '@/components/ui/boards/store';
import { STORE_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Stall extends Interactable {
  private store: Store;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames.stall);

    this.store = ServiceLocator.resolve(ServiceKeys.ui).getBoard<Store>('store');
  }

  protected onEnter(): void {
    this.store.registerStoreEvents();
    this.ui.showHorizontalTooltip(
      {
        x: INTERACT_TOOLTIP.X,
        y: INTERACT_TOOLTIP.Y,
        width: INTERACT_TOOLTIP.WIDTH,
        fillColor: INTERACT_TOOLTIP.FILL_COLOR,
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
