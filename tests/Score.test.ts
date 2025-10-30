import { describe, it, expect, beforeEach } from 'vitest';
import { Score } from '../src/game/Score';

describe('Score', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('accumulates from distance and persists hi score', () => {
    const s = new Score();
    s.addDistance(1000, performance.now());
    const v = s.value;
    expect(v).toBeGreaterThan(0);
    // simulate new run beating high score
    const s2 = new Score();
    s2.addDistance(2000, performance.now());
    expect(s2.hi).toBeGreaterThanOrEqual(s.hi);
  });
});


