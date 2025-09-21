import { Character, CharacterConfig } from '@/objects/core/character';
import { Movement } from '@/components/modules/movement';
import { Wait } from '@/components/states/enemy-states/wait';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Chase } from '@/components/states/enemy-states/chase';
import { Attack } from '@/components/states/enemy-states/attack';
import { Death } from '@/components/states/core/death';
import { ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';

export class SkeletonWarrior extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.walkBound = SKELETON_WARRIOR_STATS.WALK_BOUND;
    this.patrolRightX = this.x + this.walkBound;
    this.patrolLeftX = this.x - this.walkBound;

    this.animations = {
      idle: ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE,
      moveLeft: ENEMIES_ANIMATION.SKELETON_WARRIOR.LEFT,
      moveRight: ENEMIES_ANIMATION.SKELETON_WARRIOR.RIGHT,
      attack: ENEMIES_ANIMATION.SKELETON_WARRIOR.SIMPLE_ATTACK,
      death: ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH,
    };

    this.movement = new Movement(SKELETON_WARRIOR_STATS.WALK);

    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Wait(this));
    this.stateMachine.addState(new Chase(this));
    this.stateMachine.addState(new Attack(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.SKELETON_WARRIOR, 37));

    this.arcadeBody.setSize(25, 48);
  }

  update(): void {
    this.stateMachine.update();
  }
}
