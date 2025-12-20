import { Character } from '@/base/objects/character';
import { Sprite } from '@/base/objects/sprite';

type VFXConfig = {
  scene: Phaser.Scene;
  caster: Character;
  keyName: string;
  animKey: string;
  offsetX?: number;
  offsetY?: number;
  frame?: number;
  isFlipping?: boolean;
};

export class AttachedVfx extends Sprite {
  private caster: Character;
  private offsetX: number;
  private offsetY: number;
  private animKey: string;

  constructor({
    scene,
    caster,
    keyName,
    animKey,
    offsetX = 0,
    offsetY = 0,
    frame = 0,
    isFlipping = false,
  }: VFXConfig) {
    const position = caster.getPosition();
    super({ scene, position, keyName, frame });

    this.caster = caster;
    this.animKey = animKey;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    if (isFlipping) {
      this.setFlipX(!this.caster.getFacingRight());
    }

    this.playAnimation();
    this.bindDestroyOnAnimationEnd();
  }

  public preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.caster || !this.scene) return;

    this.x = this.caster.x + this.offsetX;
    this.y = this.caster.y + this.offsetY;
  }

  private playAnimation(): void {
    this.play(this.animKey);
  }

  private bindDestroyOnAnimationEnd(): void {
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}
