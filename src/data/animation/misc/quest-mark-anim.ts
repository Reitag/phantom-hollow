import { MISC_ANIMATION } from '@/constants/animation-keys';
import { MISC } from '@/constants/asset-keys';

export function questMarkAnim(anims: Phaser.Animations.AnimationManager) {
  if (!anims.get(MISC_ANIMATION.QUEST_MARK.MAIN)) {
    anims.create({
      key: MISC_ANIMATION.QUEST_MARK.MAIN,
      frames: anims.generateFrameNumbers(MISC.QUEST_MARK, { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!anims.get(MISC_ANIMATION.QUEST_MARK.MAIN_2)) {
    anims.create({
      key: MISC_ANIMATION.QUEST_MARK.MAIN_2,
      frames: anims.generateFrameNumbers(MISC.QUEST_MARK, { start: 2, end: 3 }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!anims.get(MISC_ANIMATION.QUEST_MARK.MAIN_3)) {
    anims.create({
      key: MISC_ANIMATION.QUEST_MARK.MAIN_3,
      frames: anims.generateFrameNumbers(MISC.QUEST_MARK, { start: 4, end: 5 }),
      frameRate: 1,
      repeat: -1,
    });
  }
}
