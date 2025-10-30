import { describe, it, expect } from 'vitest';
import { minGapForSpeed } from '../src/game/Spawner';

describe('Spawner min gap', () => {
  it('increases with speed', () => {
    const g1 = minGapForSpeed(600);
    const g2 = minGapForSpeed(1000);
    expect(g2).toBeGreaterThan(g1);
  });

  it('respects base gap at 0 speed', () => {
    const g0 = minGapForSpeed(0);
    const gPos = minGapForSpeed(1);
    expect(gPos).toBeGreaterThanOrEqual(g0);
  });
});


