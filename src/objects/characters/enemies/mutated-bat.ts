import { Hover } from '@/components/states/enemy-states/hover';
import { Dive } from '@/components/states/enemy-states/dive';
import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { Character, CharacterConfig } from '@/objects/core/character';

export class MutatedBat extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      idle: ENEMIES_ANIMATION.MUTADED_BAT.IDLE,
      death: ENEMIES_ANIMATION.MUTADED_BAT.DEATH,
    };

    this.stateMachine.addState(new Hover(this));
    this.stateMachine.addState(new Dive(this));

    this.arcadeBody.setSize(10, 10);
    this.arcadeBody.setAllowGravity(false);
  }

  public update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
