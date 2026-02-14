import { Sprite } from '@/base/objects/sprite';
import { MISC_ANIMATION } from '@/constants/animation-keys';
import { SpriteConfig } from '@/utils/types';

export class QuestMark extends Sprite {
  constructor({ scene, position, keyName, frame }: SpriteConfig) {
    super({ scene, position, keyName, frame });
    this.setOrigin(0, 0);

    this.anims.play(MISC_ANIMATION.QUEST_MARK.MAIN);
  }

  public changeMarkToWaiting(): void {
    this.anims.play(MISC_ANIMATION.QUEST_MARK.MAIN_2, true);
  }

  public changeMarkToCompleted(): void {
    this.anims.play(MISC_ANIMATION.QUEST_MARK.MAIN_3, true);
  }
}
