import { Character, CharacterConfig } from '@/base/objects/character';
import { Idle } from '@/components/states/share/idle';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Chase } from '@/components/states/enemy-states/chase';
import { Attack } from '@/components/states/enemy-states/attack';
import { Freeze } from '@/components/states/share/freeze';
import { Death } from '@/components/states/share/death';
import { CHARACTER_ANIMATION_KEYS, ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';

export class SkeletonWarrior extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      [CHARACTER_ANIMATION_KEYS.IDLE]: ENEMIES_ANIMATION.SKELETON_WARRIOR.IDLE,
      [CHARACTER_ANIMATION_KEYS.MOVE]: ENEMIES_ANIMATION.SKELETON_WARRIOR.MOVE,
      [CHARACTER_ANIMATION_KEYS.ATTACK]: ENEMIES_ANIMATION.SKELETON_WARRIOR.ATTACK,
      [CHARACTER_ANIMATION_KEYS.DEATH]: ENEMIES_ANIMATION.SKELETON_WARRIOR.DEATH,
    };

    this.stateMachine.addState(new Idle(this));
    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Chase(this));
    this.stateMachine.addState(new Attack(this));
    this.stateMachine.addState(new Freeze(this, CHARACTERS.SKELETON_WARRIOR));
    this.stateMachine.addState(new Death(this, CHARACTERS.SKELETON_WARRIOR, 37));

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
