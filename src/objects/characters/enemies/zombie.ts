import { Character, CharacterConfig } from '@/objects/core/character';
import { Movement } from '@/components/modules/movement';
import { Wait } from '@/components/states/enemy-states/wait';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Chase } from '@/components/states/enemy-states/chase';
import { Attack } from '@/components/states/enemy-states/attack';
import { Death } from '@/components/states/core/death';
import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';
import { ZOMBIE_STATS } from '@/constants/object-stats';

export class Zombie extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.walkBound = ZOMBIE_STATS.WALK_BOUND;
    this.patrolRightX = this.x + this.walkBound;
    this.patrolLeftX = this.x - this.walkBound;

    this.animations = {
      idle: ENEMIES_ANIMATION.ZOMBIE.IDLE,
      moveLeft: ENEMIES_ANIMATION.ZOMBIE.LEFT,
      moveRight: ENEMIES_ANIMATION.ZOMBIE.RIGHT,
      attack: ENEMIES_ANIMATION.ZOMBIE.SIMPLE_ATTACK,
      death: ENEMIES_ANIMATION.ZOMBIE.DEATH,
    };

    this.movement = new Movement(ZOMBIE_STATS.WALK);

    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Wait(this));
    this.stateMachine.addState(new Chase(this));
    this.stateMachine.addState(new Attack(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.ZOMBIE, 25));

    this.arcadeBody.setSize(25, 48);
  }

  update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
