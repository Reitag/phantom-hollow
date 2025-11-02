import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export function evilwizardAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.IDLE)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.IDLE,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 0, end: 9 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.MOVE)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.MOVE,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 18, end: 25 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.RUN)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.RUN,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 36, end: 43 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.CAST)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.CAST,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 54, end: 66 }),
      frameRate: 15,
      repeat: 0,
    });
  }

  if (!anims.get(BOSSES_ANIMATION.EVIL_WIZARD.DEATH)) {
    anims.create({
      key: BOSSES_ANIMATION.EVIL_WIZARD.DEATH,
      frames: anims.generateFrameNumbers(CHARACTERS.EVIL_WIZARD, { start: 72, end: 89 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
