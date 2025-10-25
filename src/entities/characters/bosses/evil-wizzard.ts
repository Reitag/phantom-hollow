import { Character, CharacterConfig } from '@/base/objects/character';
import { BOSSES_ANIMATION, CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { Idle } from '@/components/states/share/idle';
import { Casting } from '@/components/states/enemy-states/casting';
import { Death } from '@/components/states/share/death';
import { CHARACTERS } from '@/constants/asset-keys';
import { SHARED_STATES } from '@/constants/state-keys';

export class EvilWizzard extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      [CHARACTER_ANIMATION_KEYS.IDLE]: BOSSES_ANIMATION.EVIL_WIZARD.IDLE,
      [CHARACTER_ANIMATION_KEYS.CAST]: BOSSES_ANIMATION.EVIL_WIZARD.CAST,
      [CHARACTER_ANIMATION_KEYS.DEATH]: BOSSES_ANIMATION.EVIL_WIZARD.DEATH,
    };

    this.stateMachine.addState(new Idle(this));
    this.stateMachine.addState(new Casting(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.EVIL_WIZARD, 53));

    this.stateMachine.changeState(SHARED_STATES.IDLE);

    this.arcadeBody.setSize(30, 53);
    this.arcadeBody.setOffset((this.width - 30) / 2, this.height - 53);
  }

  update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
