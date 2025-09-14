import { ModifierFactory } from '@/factories/modifier-factory';
import { Modifier } from '@/modifiers/core/modifier';
import { Character } from '@/objects/core/character';

export class ModifierManager {
  private modifiers: Modifier[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addModifier(id: string): void {
    this.modifiers.push(ModifierFactory.create(this.scene, id));
  }

  public removeModifier(id: string): void {
    this.modifiers = this.modifiers.filter((elem) => elem.id !== id);
  }

  public startModifier(id: string, target: Character): void {
    const modifier = this.modifiers.find((modifier) => modifier.id === id);
    modifier?.start(target, () => this.removeModifier(id));
  }

  public isModifierExist(id: string): boolean {
    return this.modifiers.some((modifier) => modifier.id === id);
  }
}
