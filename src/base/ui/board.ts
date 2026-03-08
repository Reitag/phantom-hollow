import { Position } from '@/utils/types';

export abstract class Board {
  protected open = false;
  protected board: Phaser.GameObjects.Container | null = null;
  protected container: Phaser.GameObjects.Container | null = null;

  constructor(public scene: Phaser.Scene) {}

  public get isOpen(): boolean {
    return this.open;
  }

  // Converts Figma top-left coords to Phaser centered local coords
  protected alignCoords(bg: Phaser.GameObjects.Image, x: number, y: number): Position {
    return {
      x: x - bg.width / 2,
      y: y - bg.height / 2,
    };
  }

  protected openBoard() {
    this.board?.setVisible(true);
    this.open = true;
  }

  protected closeBoard() {
    this.board?.setVisible(false);
    this.open = false;
  }
}
