import { Character, CharacterConfig } from '@/objects/core/character';
import { Wait } from '@/components/states/characters/enemy-states/wait';
import { Patrol } from '@/components/states/characters/enemy-states/patrol';
import { Chase } from '@/components/states/characters/enemy-states/chase';
import { Attack } from '@/components/states/characters/enemy-states/attack';
import { Death } from '@/components/states/characters/core/death';
import { ENEMIES } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';
import { SKELETON_WARRIOR_STATS } from '@/constants/object-stats';

export class SkeletonWarrior extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.walkBound = SKELETON_WARRIOR_STATS.WALK_BOUND;
    this.patrolRightX = this.x + this.walkBound;
    this.patrolLeftX = this.x - this.walkBound;

    this.animations = {
      idle: ENEMIES.SKELETON_WARRIOR.IDLE,
      moveLeft: ENEMIES.SKELETON_WARRIOR.LEFT,
      moveRight: ENEMIES.SKELETON_WARRIOR.RIGHT,
      attack: ENEMIES.SKELETON_WARRIOR.SIMPLE_ATTACK,
      death: ENEMIES.SKELETON_WARRIOR.DEATH,
    };

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
