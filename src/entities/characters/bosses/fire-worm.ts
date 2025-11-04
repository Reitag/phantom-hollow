import { Character, CharacterConfig } from '@/base/objects/character';
import { BOSSES_ANIMATION, CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { Idle } from '@/components/states/share/idle';
import { Casting } from '@/components/states/enemy-states/casting';
import { Patrol } from '@/components/states/enemy-states/patrol';
import { Death } from '@/components/states/share/death';
import { CHARACTERS } from '@/constants/asset-keys';

export class FireWorm extends Character {
  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.animations = {
      [CHARACTER_ANIMATION_KEYS.IDLE]: BOSSES_ANIMATION.FIRE_WORM.IDLE,
      [CHARACTER_ANIMATION_KEYS.MOVE]: BOSSES_ANIMATION.FIRE_WORM.MOVE,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_START]: BOSSES_ANIMATION.FIRE_WORM.CAST_START,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN]: BOSSES_ANIMATION.FIRE_WORM.CAST_MAIN,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_END]: BOSSES_ANIMATION.FIRE_WORM.CAST_END,
      [CHARACTER_ANIMATION_KEYS.DEATH]: BOSSES_ANIMATION.FIRE_WORM.DEATH,
    };

    this.stateMachine.addState(new Idle(this));
    this.stateMachine.addState(new Patrol(this));
    this.stateMachine.addState(new Casting(this));
    this.stateMachine.addState(new Death(this, CHARACTERS.FIRE_WORM, 55));

    this.arcadeBody.setSize(30, 33);
    this.arcadeBody.setOffset((this.width - 30) / 2, this.height - 33);
  }

  update(delta: number): void {
    this.stateMachine.update(delta);
  }
}
