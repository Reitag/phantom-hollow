import { Character, CharacterConfig } from '@/base/objects/character';
import { RangeAttack } from '@/components/states/enemy-states/range-attack';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Death } from '@/components/states/share/death';
import { CHARACTER_ANIMATION_KEYS, ENEMIES_ANIMATION } from '@/constants/animation-keys';
import { CHARACTERS } from '@/constants/asset-keys';
import { Idle } from '@/components/states/share/idle';

export class Archer extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      [CHARACTER_ANIMATION_KEYS.IDLE]: ENEMIES_ANIMATION.ARCHER.IDLE,
      [CHARACTER_ANIMATION_KEYS.MOVE]: ENEMIES_ANIMATION.ARCHER.MOVE,
      [CHARACTER_ANIMATION_KEYS.RANGED_UPPER_ATTACK]: ENEMIES_ANIMATION.ARCHER.RANGED_UPPER_ATTACK,
      [CHARACTER_ANIMATION_KEYS.RANGED_STRAIGHT_ATTACK]:
        ENEMIES_ANIMATION.ARCHER.RANGED_STRAIGHT_ATTACK,
      [CHARACTER_ANIMATION_KEYS.RANGED_DOWN_ATTACK]: ENEMIES_ANIMATION.ARCHER.RANGED_DOWN_ATTACK,
      [CHARACTER_ANIMATION_KEYS.DEATH]: ENEMIES_ANIMATION.ARCHER.DEATH,
    };

    this.stateMachine.addState(new Idle(this));
    this.stateMachine.addState(new RangeAttack(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.ARCHER, 57));

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
