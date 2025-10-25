import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function evilwizardAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.IDLE)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 1, end: 9 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.CAST)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.CAST,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 18, end: 30 }),
      frameRate: 15,
      repeat: 0,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.DEATH)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 36, end: 53 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
