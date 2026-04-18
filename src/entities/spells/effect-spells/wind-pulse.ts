import { Spell, SpellConfig } from '@/base/objects/spell';
import { WIND_WAVE_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { SHARED_STATES } from '@/constants/state-keys';
import { SPELL_ANIMATION_KEYS, SPELLS_ANIMATION } from '@/constants/animation-keys';
import { FireWorm } from '@/entities/characters/bosses/fire-worm';
import { EvilWizzard } from '@/entities/characters/bosses/evil-wizzard';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';
import { AUDIO, SPELLS } from '@/constants/asset-keys';
import { Player } from '@/entities/characters/player/player';
import { AudioSystem } from '@/systems/audio-system';

const offsetX = 45;

export class WindPulse {
  private readonly leftDirection = -1;
  private readonly rightDirection = 1;

  private leftWave: WindWave;
  private rightWave: WindWave;

  private audioSystem: AudioSystem;

  constructor(scene: Phaser.Scene, position: Position, caster: Character) {
    this.leftWave = new WindWave({
      scene: scene,
      position: position,
      keyName: SPELLS.WIND_WAVE,
      frame: 0,
      caster: caster,
      direction: this.leftDirection,
    });
    this.rightWave = new WindWave({
      scene: scene,
      position: position,
      keyName: SPELLS.WIND_WAVE,
      frame: 0,
      caster: caster,
      direction: this.rightDirection,
    });
    this.audioSystem = ServiceLocator.resolve(ServiceKeys.audio);
  }

  public castWaves(): void {
    this.leftWave.cast();
    this.rightWave.cast();
    this.audioSystem.play(AUDIO.WIND_ACTION);
  }

  public getWindWaves(): { leftWave: WindWave; rightWave: WindWave } {
    return {
      leftWave: this.leftWave,
      rightWave: this.rightWave,
    };
  }

  public destroy(): void {
    this.leftWave.destroy();
    this.rightWave.destroy();
  }
}

class WindWave extends Spell {
  constructor({ scene, position, keyName, frame, caster, speed, direction }: SpellConfig) {
    const { x, y } = position;

    super({
      scene,
      position: { x: x + offsetX * (direction ?? 1), y: y },
      keyName,
      frame,
      caster,
      speed,
      direction,
    });

    this.animations = {
      [SPELL_ANIMATION_KEYS.MAIN]: SPELLS_ANIMATION.WIND_WAVE.MAIN,
    };

    this.arcadeBody.setSize(90, 48);
  }

  public cast(): void {
    this.playMainAnimation();

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.caster.getDead()) {
      this.destroy();
      return;
    }
    this.x = this.caster.x + offsetX * (this.direction ?? 1);
    this.y = this.caster.y;
  }

  public applyEffect(target: Character): void {
    if (!target || target instanceof Player) return;

    const fsm = target.getStateMachine();

    if (
      target instanceof FireWorm ||
      target instanceof EvilWizzard ||
      fsm.currentStateName === SHARED_STATES.FREEZE
    ) {
      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.showDamageDealt('Invulnerable', target);
    } else {
      target.getStats().speed?.applyForce(WIND_WAVE_STATS.FORCE);
    }
  }
}
