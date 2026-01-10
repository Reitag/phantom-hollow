import { Character, CharacterConfig } from '@/base/objects/character';

export class Alchemist extends Character {
  public scene: Phaser.Scene;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.scene = scene;

    const spriteHeight = this.height;
    const spriteWidth = this.width;
    const bodyHeight = 35;
    const bodyWidth = 15;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    //this.arcadeBody.setOffset((spriteWidth - bodyWidth) / 2, spriteHeight - bodyHeight);
  }

  public update(): void {}
}
