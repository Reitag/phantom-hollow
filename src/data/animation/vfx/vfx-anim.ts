import { VFX_ANIMATION } from '@/constants/animation-keys';
import { VFX } from '@/constants/asset-keys';

export function vfxAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(VFX_ANIMATION.FREEZE.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.FREEZE.MAIN,
      frames: anims.generateFrameNumbers(VFX.FREEZE_VFX, { start: 0, end: 7 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.FREEZE.END)) {
    anims.create({
      key: VFX_ANIMATION.FREEZE.END,
      frames: anims.generateFrameNumbers(VFX.FREEZE_VFX, { start: 7, end: 15 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.RESPAWN.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.RESPAWN.MAIN,
      frames: anims.generateFrameNumbers(VFX.RESPAWN_VFX, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.HEAL.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.HEAL.MAIN,
      frames: anims.generateFrameNumbers(VFX.HEAL_VFX, { start: 0, end: 13 }),
      frameRate: 24,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.PROTECTION.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.PROTECTION.MAIN,
      frames: anims.generateFrameNumbers(VFX.PROTECTION_VFX, { start: 0, end: 12 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.SPELL.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.SPELL.MAIN,
      frames: anims.generateFrameNumbers(VFX.SPELL_VFX, { start: 0, end: 9 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.UNDYING.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.UNDYING.MAIN,
      frames: anims.generateFrameNumbers(VFX.UNDYING_VFX, { start: 0, end: 19 }),
      frameRate: 14,
      repeat: 0,
    });
  }

  if (!anims.get(VFX_ANIMATION.ARCANE_MIND.MAIN)) {
    anims.create({
      key: VFX_ANIMATION.ARCANE_MIND.MAIN,
      frames: anims.generateFrameNumbers(VFX.ARCANE_MIND_VFX, { start: 0, end: 9 }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
