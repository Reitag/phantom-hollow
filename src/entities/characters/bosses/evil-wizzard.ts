import { Character, CharacterConfig } from '@/base/objects/character';
import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { Idle } from '@/components/states/share/idle';
import { Casting } from '@/components/states/enemy-states/casting';
import { Death } from '@/components/states/share/death';
import { CHARACTERS } from '@/constants/asset-keys';

export class EvilWizzard extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      idle: BOSSES_ANIMATION.EVIL_WIZARD.IDLE,
      attack: BOSSES_ANIMATION.EVIL_WIZARD.SIMPLE_ATTACK,
      death: BOSSES_ANIMATION.EVIL_WIZARD.DEATH,
    };

    this.stateMachine.addState(new Idle(this));
    this.stateMachine.addState(new Casting(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.EVIL_WIZARD, 53));

    this.stateMachine.changeState('Idle');

    this.arcadeBody.setSize(30, 53);
    this.arcadeBody.setOffset((this.width - 30) / 2, this.height - 53);
  }

  update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
