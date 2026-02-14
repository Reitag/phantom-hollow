import { UI } from '@/constants/asset-keys';
import { SCENE_SIZE } from '@/constants/scene-size';
import { STORE_UI } from '@/constants/ui-coordinates';
import { STORE_ITEMS, StoreItem } from '@/game/economy/store-items';
import { Board } from '@/base/ui/board';

type Bundle = {
  item: StoreItem;
  card: Phaser.GameObjects.Container;
};

type Handlers = {
  onOver: () => void;
  onOut: () => void;
  onDown: () => void;
  onUp: () => void;
};

export class Store extends Board {
  private onCloseDown = () => this.closeBoard();
  private onCloseOver = () => this.onButtonHover(true);
  private onCloseOut = () => this.onButtonHover(false);

  private closeButton: Phaser.GameObjects.Image;
  private hoverEffect: Phaser.GameObjects.Graphics | null = null;
  private bundles: Bundle[] = [];
  private bundleHandlers = new Map<Phaser.GameObjects.Image, Handlers>();

  constructor(scene: Phaser.Scene) {
    super(scene);
    // Container and bg
    this.board = this.scene.add.container(SCENE_SIZE.WIDTH / 2, SCENE_SIZE.HEIGHT / 2);
    this.board.setVisible(false);

    const bg = this.scene.add.image(0, 0, UI.STORE_UI);
    this.board.add(bg);

    const conPos = this.alignCoords(bg, 399.5, 157.5);
    this.container = this.scene.add.container(conPos.x, conPos.y);
    this.board.add(this.container);

    // Create items
    this.createStoreItems();

    // Close button
    const btnPos = this.alignCoords(bg, STORE_UI.EXIT_BUTTON.X, STORE_UI.EXIT_BUTTON.Y);
    this.closeButton = this.scene.add
      .image(btnPos.x, btnPos.y, UI.STORE_UI_CLOSE_BUTTON)
      .setInteractive({ useHandCursor: true });

    this.board.add(this.closeButton);
  }

  public registerStoreEvents() {
    if (!this.scene.events.listeners('open-store').length) {
      this.scene.events.on('open-store', this.openBoard, this);
      this.scene.events.on('close-store', this.closeBoard, this);
    }

    if (!this.closeButton.listeners('pointerdown').length) {
      this.closeButton
        .on('pointerdown', this.onCloseDown)
        .on('pointerover', this.onCloseOver)
        .on('pointerout', this.onCloseOut);
    }

    this.bundles.forEach((bundle) => {
      const card = bundle.card;
      const bg = card.getByName('background') as Phaser.GameObjects.Image;
      const pos = this.alignCoords(bg, bg.x, bg.y);
      const onOver = () => {
        this.hoverEffect = this.scene.add
          .graphics()
          .fillStyle(0xfce2bd, 0.2)
          .fillRoundedRect(pos.x, pos.y, bg.width, bg.height, 6);
        card.add(this.hoverEffect);
      };

      const onOut = () => {
        if (this.hoverEffect) {
          card.remove(this.hoverEffect);
          this.hoverEffect.destroy();
          this.hoverEffect = null;
        }
      };

      const onDown = () => {
        if (this.hoverEffect) {
          card.remove(this.hoverEffect);
          this.hoverEffect.destroy();
        }
        this.hoverEffect = this.scene.add
          .graphics()
          .fillStyle(0x877965, 0.2)
          .fillRoundedRect(pos.x, pos.y, bg.width, bg.height, 6);
        card.add(this.hoverEffect);
      };

      const onUp = () => {
        if (this.hoverEffect) {
          card.remove(this.hoverEffect);
          this.hoverEffect.destroy();
        }
        this.hoverEffect = this.scene.add
          .graphics()
          .fillStyle(0xfce2bd, 0.2)
          .fillRoundedRect(pos.x, pos.y, bg.width, bg.height, 6);
        card.add(this.hoverEffect);
        this.purchaseItem(bundle.item);
      };

      this.bundleHandlers.set(bg, { onOver, onOut, onDown, onUp });

      bg.on('pointerover', onOver)
        .on('pointerout', onOut)
        .on('pointerdown', onDown)
        .on('pointerup', onUp);
    });
  }

  public unregisterStoreEvents() {
    this.scene.events.off('open-store', this.openBoard, this);
    this.scene.events.off('close-store', this.closeBoard, this);

    this.closeButton
      .off('pointerdown', this.onCloseDown)
      .off('pointerover', this.onCloseOver)
      .off('pointerout', this.onCloseOut);

    this.bundles.forEach((bundle) => {
      const bg = bundle.card.getByName('background') as Phaser.GameObjects.Image;
      const handlers = this.bundleHandlers.get(bg);
      if (!handlers) return;

      bg.off('pointerover', handlers.onOver)
        .off('pointerout', handlers.onOut)
        .off('pointerdown', handlers.onDown)
        .off('pointerup', handlers.onUp);

      this.bundleHandlers.delete(bg);
    });
  }

  private createStoreItems(): void {
    const columns = 3;
    const cardSpacingX = 251;
    const rowSpacingY = 192;

    STORE_ITEMS.forEach((item, index) => {
      const rowIndex = Math.floor(index / columns);
      const colIndex = index % columns;

      // create row only once
      let row = this.container?.getByName(`row-${rowIndex}`) as Phaser.GameObjects.Container;

      if (!row) {
        row = this.scene.add.container(0, rowIndex * rowSpacingY);
        row.name = `row-${rowIndex}`;
        this.container?.add(row);
      }

      const cardX = (colIndex - 1) * cardSpacingX;

      const card = this.createItemCard(item, cardX, 0);
      row.add(card);
    });
  }

  private createItemCard(item: StoreItem, x: number, y: number) {
    const card = this.scene.add.container(x, y);
    const bg = this.scene.add
      .image(0, 0, UI.ITEM_CARD)
      .setName('background')
      .setInteractive({ useHandCursor: true });

    const imgPos = this.alignCoords(bg, STORE_UI.ITEM_CARD.ICON.X, STORE_UI.ITEM_CARD.ICON.Y);
    const namePos = this.alignCoords(bg, STORE_UI.ITEM_CARD.NAME.X, STORE_UI.ITEM_CARD.NAME.Y);
    const pricePos = this.alignCoords(bg, STORE_UI.ITEM_CARD.PRICE.X, STORE_UI.ITEM_CARD.PRICE.Y);
    const textPos = this.alignCoords(bg, STORE_UI.ITEM_CARD.TEXT.X, STORE_UI.ITEM_CARD.TEXT.Y);

    const icon = this.scene.add.image(imgPos.x, imgPos.y, item.iconKey);
    const name = this.scene.add.text(namePos.x, namePos.y, `${item.name}`, {
      font: '12px Arial',
      color: '##fff2d8',
    });
    const price = this.scene.add.text(pricePos.x, pricePos.y, `${item.price} coins`, {
      font: '12px Arial',
      color: '#ffd84d',
    });
    const text = this.scene.add.text(textPos.x, textPos.y, `${item.description}`, {
      font: '12px Arial',
      color: '#000000',
      fixedWidth: 200,
      fixedHeight: 90,
      wordWrap: {
        width: 200,
      },
    });

    card.add([bg, icon, name, text, price]);

    this.bundles.push({ item, card });

    return card;
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
}
