import { CHARACTERS } from '@/constants/asset-keys';
import {
  ARCHER_STATS,
  EVIL_WIZARD_STATS,
  FIRE_WORM_STATS,
  SKELETON_WARRIOR_STATS,
  ZOMBIE_STATS,
} from '@/constants/object-stats';
import { Player } from '@/entities/characters/player/player';
import { Archer } from '@/entities/characters/enemies/archer';
import { SkeletonWarrior } from '@/entities/characters/enemies/skeleton-warrior';
import { Zombie } from '@/entities/characters/enemies/zombie';
import { EvilWizzard } from '@/entities/characters/bosses/evil-wizzard';
import { FireWorm } from '@/entities/characters/bosses/fire-worm';
import { SpawnPoint } from '@/utils/types';
import { Z_POSITION } from '@/constants/z-position';
import { AiArcher } from '@/ai/enemies/ai-archer';
import { AiSkeletonWarrior } from '@/ai/enemies/ai-skeleton-warrior';
import { AiZombie } from '@/ai/enemies/ai-zombie';
import { AiFireWorm } from '@/ai/bosses/ai-fire-worm';
import { AiEvilWizard } from '@/ai/bosses/ai-evil-wizard';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { CollisionService, GroupKeys } from '@/infrastructure/collision-service';
import {
  ARCHERS_SPAWN_POSITION,
  EVIL_WIZZARD_SPAWN_POSITION,
  FIRE_WORM_SPAWN_POSITION,
  SKELETONS_SPAWN_POSITION,
  ZOMBIES_SPAWN_POSITION,
} from '@/constants/spawn-positions';

type EnemyType = 'skeleton' | 'zombie' | 'archer';

export class EnemySpawn {
  private readonly spawnDistance = 700;
  private readonly despawnDistance = 800;

  private readonly spawnPositions: Record<EnemyType, SpawnPoint[]> = {
    skeleton: SKELETONS_SPAWN_POSITION,
    zombie: ZOMBIES_SPAWN_POSITION,
    archer: ARCHERS_SPAWN_POSITION,
  };

  private aiSkeletonWarrior = new AiSkeletonWarrior(
    ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer()
  );
  private aiZombie = new AiZombie(ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer());
  private aiArcher = new AiArcher(ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer());
  private aiFireWorm: AiFireWorm;
  private aiEvilWizard: AiEvilWizard;

  constructor(private scene: Phaser.Scene) {
    const evelWizzard = new EvilWizzard({
      scene: scene,
      position: EVIL_WIZZARD_SPAWN_POSITION,
      keyName: CHARACTERS.EVIL_WIZARD,
      frame: 0,
      facingRight: false,
      stats: {
        health: EVIL_WIZARD_STATS.HEALTH,
        speed: EVIL_WIZARD_STATS.WALK,
        damage: {
          meleeAttack: undefined,
          spellPower: EVIL_WIZARD_STATS.SPELL_POWER,
        },
        defense: undefined,
        aggro: true,
      },
    }).setDepth(Z_POSITION.ENEMY);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(evelWizzard, true);
    this.aiEvilWizard = new AiEvilWizard(
      evelWizzard,
      ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer()
    );

    const fireWorm = new FireWorm({
      scene: scene,
      position: FIRE_WORM_SPAWN_POSITION,
      keyName: CHARACTERS.FIRE_WORM,
      frame: 0,
      facingRight: false,
      stats: {
        health: FIRE_WORM_STATS.HEALTH,
        speed: FIRE_WORM_STATS.WALK,
        damage: {
          meleeAttack: undefined,
          spellPower: FIRE_WORM_STATS.SPELL_POWER,
        },
        defense: undefined,
        aggro: true,
      },
    }).setDepth(Z_POSITION.ENEMY);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(fireWorm, true);
    this.aiFireWorm = new AiFireWorm(
      fireWorm,
      ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer()
    );
  }

  public update(player: Player, delta: number): void {
    this.aiSkeletonWarrior.update(delta);
    this.aiZombie.update(delta);
    this.aiArcher.update(delta);
    this.aiFireWorm.update(delta);
    this.aiEvilWizard.update(delta);

    const playerX = Math.round(player.x);

    this.handleSpawn(playerX, 'skeleton', (pos) => this.spawnSkeleton(pos));
    this.handleSpawn(playerX, 'zombie', (pos) => this.spawnZombie(pos));
    this.handleSpawn(playerX, 'archer', (pos) => this.spawnArcher(pos));

    this.handleDespawn(playerX);
  }

  private handleSpawn(playerX: number, type: EnemyType, spawnFn: (pos: SpawnPoint) => void): void {
    const spawnArray = this.spawnPositions[type];

    for (const pos of spawnArray) {
      if (!pos.isSpawned && Math.abs(playerX - pos.x) < this.spawnDistance) {
        spawnFn(pos);
        pos.isSpawned = true;
      }
    }
  }

  private handleDespawn(playerX: number): void {
    const aiList = [this.aiSkeletonWarrior, this.aiZombie, this.aiArcher];
    for (const ai of aiList) {
      const enemies = ai.getEnemyMap();
      enemies.keys().forEach((enemy) => {
        const distance = Math.abs(enemy.x - playerX);

        if (distance > this.despawnDistance) {
          const spawn = enemies.get(enemy);
          if (spawn) {
            spawn.isSpawned = false;
          }
          ai.despawnEnemy(enemy);
        }
      });
    }
  }

  private spawnSkeleton(spawnPoint: SpawnPoint): void {
    const skeleton = new SkeletonWarrior({
      scene: this.scene,
      position: { x: spawnPoint.x, y: spawnPoint.y },
      keyName: CHARACTERS.SKELETON_WARRIOR,
      frame: 0,
      facingRight: false,
      stats: {
        health: SKELETON_WARRIOR_STATS.HEALTH,
        speed: SKELETON_WARRIOR_STATS.WALK,
        damage: {
          meleeAttack: SKELETON_WARRIOR_STATS.HIT,
          spellPower: undefined,
        },
        defense: undefined,
        aggro: true,
      },
    });

    spawnPoint.isSpawned = true;
    skeleton.setDepth(Z_POSITION.ENEMY);
    this.aiSkeletonWarrior.addEnemy(skeleton, spawnPoint);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(skeleton, true);
  }

  private spawnZombie(spawnPoint: SpawnPoint): void {
    const zombie = new Zombie({
      scene: this.scene,
      position: { x: spawnPoint.x, y: spawnPoint.y },
      keyName: CHARACTERS.ZOMBIE,
      frame: 0,
      facingRight: false,
      stats: {
        health: ZOMBIE_STATS.HEALTH,
        speed: ZOMBIE_STATS.WALK,
        damage: {
          meleeAttack: ZOMBIE_STATS.HIT,
          spellPower: undefined,
        },
        defense: undefined,
        aggro: true,
      },
    });

    spawnPoint.isSpawned = true;
    zombie.setDepth(Z_POSITION.ENEMY);
    this.aiZombie.addEnemy(zombie, spawnPoint);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(zombie, true);
  }

  private spawnArcher(spawnPoint: SpawnPoint): void {
    const archer = new Archer({
      scene: this.scene,
      position: { x: spawnPoint.x, y: spawnPoint.y },
      keyName: CHARACTERS.ARCHER,
      frame: 0,
      facingRight: false,
      stats: {
        health: ARCHER_STATS.HEALTH,
        speed: 0,
        damage: {
          meleeAttack: undefined,
          spellPower: undefined,
        },
        defense: undefined,
        aggro: true,
      },
    });

    spawnPoint.isSpawned = true;
    archer.setDepth(Z_POSITION.ENEMY);
    this.aiArcher.addEnemy(archer, spawnPoint);

    CollisionService.resolveGroup(GroupKeys.enemy)?.add(archer, true);
  }
}
