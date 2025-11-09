import { GraphicsMask } from '@/components/rendering/graphic-mask';
import { UI } from '@/constants/asset-keys';
import { STORE_UI } from '@/constants/ui-coordinates';
import { STORE_ITEMS, StoreItem } from '@/game/economy/store-items';

type Bundle = {
  item: StoreItem;
  button: Phaser.GameObjects.Text;
};

type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export class Store {
  private readonly rowHeight = 60;
  private readonly visibleRows = 3;

  private onCloseDown = () => this.closeStore();
  private onCloseOver = () => this.onButtonHover(true);
  private onCloseOut = () => this.onButtonHover(false);

  private open = false;
  private scrollOffset = 0;
  private store: Phaser.GameObjects.Container;
  private container: Phaser.GameObjects.Container;
  private closeButton: Phaser.GameObjects.Image;
  private maskGraphics!: GraphicsMask;
  private bundles: Bundle[] = [];
  private bundleHandlers = new Map<Phaser.GameObjects.Text, Handlers>();

  constructor(public scene: Phaser.Scene) {
    // Container and bg
    this.store = this.scene.add.container(STORE_UI.BG.X, STORE_UI.BG.Y);
    this.store.setVisible(false);

    const bg = this.scene.add.image(0, 0, UI.STORE_UI).setOrigin(0.5, 0.5);
    this.store.add(bg);

    // Items container
    this.container = this.scene.add.container(
      -STORE_UI.BG.WIDTH / 2 + 60,
      -STORE_UI.BG.HEIGHT / 2 + 85
    );
    this.store.add(this.container);

    // Create items and mask
    this.createStoreItems();
    this.createAndApplyMask();

    // Close button
    this.closeButton = this.scene.add
      .image(STORE_UI.EXIT_BUTTON.X, STORE_UI.EXIT_BUTTON.Y, UI.STORE_UI_CLOSE_BUTTON)
      .setInteractive({ useHandCursor: true });

    this.store.add(this.closeButton);
  }

  public get isOpen(): boolean {
    return this.open;
  }

  public registerStoreEvents() {
    if (!this.scene.events.listeners('open-store').length) {
      this.scene.events.on('open-store', this.openStore, this);
      this.scene.events.on('close-store', this.closeStore, this);
    }

    if (!this.closeButton.listeners('pointerdown').length) {
      this.closeButton
        .on('pointerdown', this.onCloseDown)
        .on('pointerover', this.onCloseOver)
        .on('pointerout', this.onCloseOut);
    }

    this.bundles.forEach((bundle) => {
      const onOver = () => {
        bundle.button.setStyle({ color: '#ffd84d' });
        bundle.button.setScale(1.1);
      };

      const onOut = () => {
        bundle.button.setStyle({ color: '#ffff00' });
        bundle.button.setScale(1);
      };

      const onDown = () => {
        bundle.button.setTint(0xffaa00);
        bundle.button.setScale(0.95);
      };

      const onUp = () => {
        bundle.button.clearTint();
        bundle.button.setScale(1.1);
        this.purchaseItem(bundle.item);
      };

      this.bundleHandlers.set(bundle.button, { onOver, onOut, onDown, onUp });

      bundle.button
        .on('pointerover', onOver)
        .on('pointerout', onOut)
        .on('pointerdown', onDown)
        .on('pointerup', onUp);
    });
  }

  public unregisterStoreEvents() {
    this.scene.events.off('open-store', this.openStore, this);
    this.scene.events.off('close-store', this.closeStore, this);

    this.closeButton
      .off('pointerdown', this.onCloseDown)
      .off('pointerover', this.onCloseOver)
      .off('pointerout', this.onCloseOut);

    this.bundles.forEach((bundle) => {
      const handlers = this.bundleHandlers.get(bundle.button);
      if (!handlers) return;

      bundle.button
        .off('pointerover', handlers.onOver)
        .off('pointerout', handlers.onOut)
        .off('pointerdown', handlers.onDown)
        .off('pointerup', handlers.onUp);

      this.bundleHandlers.delete(bundle.button);
    });
  }

  private createStoreItems(): void {
    STORE_ITEMS.forEach((item, i) => {
      const rowY = i * this.rowHeight;

      const row = this.scene.add.container(0, rowY);
      this.container.add(row);

      const icon = this.scene.add.image(0, 0, item.iconKey);
      row.add(icon);

      const text = this.scene.add
        .text(17, 0, `${item.name} - ${item.description}`, {
          font: '14px Arial',
          color: '#ffffff',
        })
        .setOrigin(0, 0.5);
      row.add(text);

      const priceText = this.scene.add
        .text(420, 0, `${item.price}`, {
          font: '16px Arial',
          color: '#ffff00',
        })
        .setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true });

      row.add(priceText);

      const bundle = {
        item: item,
        button: priceText,
      };
      this.bundles.push(bundle);
    });
  }

  private createAndApplyMask(): void {
    this.maskGraphics = new GraphicsMask(this.scene);

    this.maskGraphics.roundedRect({
      x: STORE_UI.MASK.X,
      y: STORE_UI.MASK.Y,
      width: STORE_UI.MASK.WIDTH,
      height: STORE_UI.MASK.HEIGHT,
      radius: STORE_UI.MASK.RADIUS,
    });

    this.maskGraphics.applyTo(this.container);
  }

  private purchaseItem(item: StoreItem): void {
    item.onBuy();
  }

  private onButtonHover(isHovering: boolean): void {
    if (isHovering) {
      this.closeButton.setScale(1.1).setTint(0xffaaaa);
    } else {
      this.closeButton.setScale(1).clearTint();
    }
  }

  private openStore() {
    this.store.setVisible(true);
    this.open = true;
    this.registerScroll();
  }

  private closeStore() {
    this.store.setVisible(false);
    this.open = false;
    this.unregisterScroll();
  }

  private registerScroll(): void {
    this.scene.input.on('wheel', this.onScroll, this);
  }

  private unregisterScroll(): void {
    this.scene.input.off('wheel', this.onScroll, this);
  }

  private onScroll(
    _pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _dx: number,
    dy: number
  ): void {
    const totalHeight = this.bundles.length * this.rowHeight;
    const maxOffset = Math.max(0, totalHeight - this.visibleRows * this.rowHeight);

    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset + dy * 0.5, 0, maxOffset);
    this.container.y = -this.scrollOffset - STORE_UI.BG.HEIGHT / 2 + 85;
  }
}
