import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';
import { Position } from '@/utils/types';

export abstract class Cell {
  protected cells: Phaser.GameObjects.Image[];

  constructor(protected scene: Phaser.Scene) {
    const uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);

    const slots = [
      getUiCoords(uiCoords, 'slot-1'),
      getUiCoords(uiCoords, 'slot-2'),
      getUiCoords(uiCoords, 'slot-3'),
      getUiCoords(uiCoords, 'slot-4'),
    ];

    this.cells = new Array(slots.length);

    slots.forEach((slot, index) => {
      this.cells[index] = scene.add.image(slot.x, slot.y, UI.INVENTORY_SLOT).setOrigin(0, 0);
    });
  }

  public get cellQuantity(): number {
    return this.cells.length;
  }

  public getIndex(position: Position): number {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];

      const left = cell.x;
      const right = cell.x + cell.displayWidth;
      const top = cell.y;
      const bottom = cell.y + cell.displayHeight;

      if (position.x >= left && position.x <= right && position.y >= top && position.y <= bottom) {
        return i;
      }
    }

    return -1;
  }

  protected getCellPosition(index: number): Position {
    return {
      x: this.cells[index].x,
      y: this.cells[index].y,
    };
  }

  protected removeCells(): void {
    this.cells.length = 0;
  }
}
