import { Character, CharacterConfig } from '@/base/objects/character';
import { NPC_ANIMATION } from '@/constants/animation-keys';

export class Alchemist extends Character {
  public scene: Phaser.Scene;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.scene = scene;

    const spriteHeight = this.height;
    const spriteWidth = this.width;
    const bodyHeight = 30;
    const bodyWidth = 15;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    this.arcadeBody.setOffset((spriteWidth - bodyWidth) / 2, spriteHeight - bodyHeight);

    this.anims.play(NPC_ANIMATION.ALCHEMIST.IDLE);
  }

  public update(): void {}
}
