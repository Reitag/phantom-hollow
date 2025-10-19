import { Character, CharacterConfig } from '@/base/objects/character';
import { Wait } from '@/components/states/enemy-states/wait';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Chase } from '@/components/states/enemy-states/chase';
import { Attack } from '@/components/states/enemy-states/attack';
import { Death } from '@/components/states/share/death';
import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export class Zombie extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      idle: ENEMIES_ANIMATION.ZOMBIE.IDLE,
      moveLeft: ENEMIES_ANIMATION.ZOMBIE.LEFT,
      moveRight: ENEMIES_ANIMATION.ZOMBIE.RIGHT,
      attack: ENEMIES_ANIMATION.ZOMBIE.SIMPLE_ATTACK,
      death: ENEMIES_ANIMATION.ZOMBIE.DEATH,
    };

    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Wait(this));
    this.stateMachine.addState(new Chase(this));
    this.stateMachine.addState(new Attack(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.ZOMBIE, 25));

    const spriteHeight = this.height;
    const bodyHeight = 30;
    const bodyWidth = 15;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    this.arcadeBody.setOffset((spriteHeight - bodyWidth) / 2, spriteHeight - bodyHeight);
  }

  update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
