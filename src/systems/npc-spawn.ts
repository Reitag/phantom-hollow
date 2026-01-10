import { CHARACTERS } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { Alchemist } from '@/entities/characters/npc/alchemist';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export class NPCSpawn {
  private readonly spawnNPC = {
    ['alchemist']: 'alchemist',
  };

  private alchemist: Alchemist;

  constructor(private scene: Phaser.Scene) {
    const spawns = this.loadNPCSpawnPoints();

    this.alchemist = new Alchemist({
      scene: scene,
      position: spawns[this.spawnNPC['alchemist']],
      keyName: CHARACTERS.ALCHEMIST,
      frame: 0,
      facingRight: true,
      stats: {
        health: undefined,
        speed: undefined,
        damage: {
          meleeAttack: undefined,
          spellPower: undefined,
        },
        defense: undefined,
        aggro: false,
      },
    }).setDepth(Z_POSITION.NPC);

    CollisionService.resolveGroup(GroupKeys.npc)?.add(this.alchemist, true);
  }

  public update(): void {
    this.alchemist.update();
  }

  private loadNPCSpawnPoints(): Record<string, Position> {
    const result: Record<string, Position> = {};

    const map = ServiceLocator.resolve(ServiceKeys.map);
    const objectLayer = map.getObjectLayer('spawn-layer');
    if (!objectLayer) return result;

    for (const obj of objectLayer.objects) {
      if (obj.name !== 'npc-spawn') continue;

      const npcType = obj.properties.find(
        (p: { name: string; type: string; value: string }) => p.name === 'npc'
      )?.value;

      if (!npcType) continue;
      if (!obj.x || !obj.y) continue;

      result[npcType] = {
        x: obj.x,
        y: obj.y,
      };
    }

    return result;
  }
}
