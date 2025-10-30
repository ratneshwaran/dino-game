import { MIN_GAP_BASE, MIN_GAP_K } from '../config';
import { RNG } from '../engine/RNG';

export function minGapForSpeed(speed: number): number {
  return MIN_GAP_BASE + MIN_GAP_K * speed;
}

export type SpawnPlan = {
  nextX: number;
  kind: 'cactus_small' | 'cactus_large' | 'bird';
  heightIdx?: number;
};

export class Spawner {
  private rng: RNG;
  private nextAtX = 0;

  constructor(rng: RNG) {
    this.rng = rng;
  }

  schedule(lastObstacleX: number, speed: number): void {
    const gap = minGapForSpeed(speed) + this.rng.int(0, 120);
    this.nextAtX = Math.max(this.nextAtX, lastObstacleX + gap);
  }

  maybeSpawn(worldX: number, score: number, speed: number): SpawnPlan | undefined {
    if (worldX >= this.nextAtX) {
      // Birds start appearing after score threshold
      const allowBird = score >= 400;
      const pBird = allowBird ? Math.min(0.35, 0.1 + speed / 5000) : 0;
      const roll = this.rng.next();
      if (roll < pBird) {
        const heightIdx = this.rng.int(0, 2); // three heights
        this.nextAtX = worldX + minGapForSpeed(speed) + this.rng.int(20, 160);
        return { nextX: worldX, kind: 'bird', heightIdx };
      }
      const kind = this.rng.next() < 0.6 ? 'cactus_small' : 'cactus_large';
      // space next spawn at least one minimal gap after this point
      this.nextAtX = worldX + minGapForSpeed(speed) + this.rng.int(0, 140);
      return { nextX: worldX, kind };
    }
    return undefined;
  }
}


