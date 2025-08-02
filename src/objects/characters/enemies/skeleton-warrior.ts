import { Character, CharacterConfig } from '@/objects/core/character';
import { Wait } from '@/components/states/characters/enemy-states/wait';
import { Patrol } from '@/components/states/characters/enemy-states/patrol';
import { Chase } from '@/components/states/characters/enemy-states/chase';
import { Attack } from '@/components/states/characters/enemy-states/attack';
import { Death } from '@/components/states/characters/core/death';
import { AnimationKeys } from '@/utils/animation-keys';

export class SkeletonWarrior extends Character {
  constructor({ scene, position, keyName, health, frame, facingRight }: CharacterConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.walkBound = 470;
    this.patrolRightX = this.x + this.walkBound;
    this.patrolLeftX = this.x - this.walkBound;

    this.animations = {
      idle: AnimationKeys.Enemies.Melee.SkeletonWarrior.Idle,
      moveLeft: AnimationKeys.Enemies.Melee.SkeletonWarrior.Left,
      moveRight: AnimationKeys.Enemies.Melee.SkeletonWarrior.Right,
      attack: AnimationKeys.Enemies.Melee.SkeletonWarrior.SimpleAttack,
      death: AnimationKeys.Enemies.Melee.SkeletonWarrior.Death,
    };

    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Wait(this));
    this.stateMachine.addState(new Chase(this));
    this.stateMachine.addState(new Attack(this));
    this.stateMachine.addState(new Death(this, 'skeleton-warrior', 37));

    this.arcadeBody.setSize(25, 48);
  }

  update(): void {
    this.stateMachine.update();
  }
}
