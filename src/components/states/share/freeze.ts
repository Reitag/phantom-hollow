import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { SHARED_STATES } from '@/constants/state-keys';
import { VFX_ANIMATION } from '@/constants/animation-keys';
import { AUDIO, VFX } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Freeze extends CharacterState {
  private characterKey: string;
  private freezeEffect?: Phaser.GameObjects.Sprite;
  private freezeDuration = 5000;

  constructor(character: Character, characterKey: string) {
    super(SHARED_STATES.FREEZE, character);
    this.character = character;
    this.characterKey = characterKey;
  }

  public onEnter(): void {
    this.setToZeroVelocityX();
    this.characterSpeed?.setMovementLock(true);
    this.character.setTint(0x66ccff);
    this.character.setAlpha(0.7);

    this.addFreezeEffect();

    const anim = this.character.anims.currentAnim;
    const frame = this.character.anims.currentFrame;

    if (anim && frame) {
      this.character.setTexture(this.characterKey, frame.frame.name);
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.FREEZE);
    }

    this.character.stop();

    this.character.scene.time.delayedCall(this.freezeDuration, () => {
      if (!this.character.getDead()) {
        this.character.getStateMachine().changeState(SHARED_STATES.IDLE);
      }
    });
  }

  public onUpdate(): void {}

  public onExit(): void {
    this.characterSpeed?.setMovementLock(false);
    this.character.clearTint();
    this.character.setAlpha(1);
    this.removeFreezeEffect();
  }

  private addFreezeEffect(): void {
    const scene = this.character.scene;
    const { x, y, depth } = this.character;

    this.freezeEffect = scene.add.sprite(x, y + 10, VFX.FREEZE_VFX);
    this.freezeEffect.play(VFX_ANIMATION.FREEZE.MAIN);
    this.freezeEffect.setDepth(depth + 1);
  }

  private removeFreezeEffect(): void {
    if (!this.freezeEffect) return;

    this.freezeEffect.play(VFX_ANIMATION.FREEZE.END);

    this.freezeEffect.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.freezeEffect?.destroy();
    });
  }
}
