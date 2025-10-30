import { GROUND_Y, VIRTUAL_WIDTH } from '../config';
import { RNG } from '../engine/RNG';

type Tree = { x: number; y: number; w: number; h: number; tone: number };

export class Trees {
  private rng: RNG;
  private trees: Tree[] = [];
  private factor = 0.22; // parallax speed factor vs ground
  private reduce = false;

  constructor(rng: RNG) {
    this.rng = rng;
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Prefill across screen
    let x = -50;
    const maxX = VIRTUAL_WIDTH + 200;
    while (x < maxX) {
      const spacing = this.rng.int(90, 210);
      x += spacing;
      this.spawnAt(x);
    }
  }

  private spawnAt(x: number): void {
    const h = this.rng.int(36, 84);
    const w = Math.max(12, Math.round(h * 0.28));
    const y = GROUND_Y - h;
    const tone = this.rng.int(0, 2); // pick a color tone variant
    this.trees.push({ x, y, w, h, tone });
  }

  update(baseSpeed: number, dt: number): void {
    const speed = baseSpeed * (this.reduce ? this.factor * 0.6 : this.factor);
    for (const t of this.trees) t.x -= speed * dt;
    // Cull
    this.trees = this.trees.filter((t) => t.x + t.w > -80);
    // Spawn to the right if needed
    const rightMost = this.trees.reduce((m, t) => Math.max(m, t.x + t.w), -Infinity);
    if (rightMost < VIRTUAL_WIDTH + 140) {
      const nextX = (rightMost === -Infinity ? VIRTUAL_WIDTH : rightMost) + this.rng.int(90, 210);
      this.spawnAt(nextX);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const t of this.trees) {
      // Colors by tone (desert palette)
      const trunk = ['#6e5b48', '#5f4f3d', '#7a6550'][t.tone];
      const leaves = ['#5e7a57', '#4e6c4a', '#6a8a62'][t.tone];
      // Trunk
      const trunkW = Math.max(4, Math.round(t.w * 0.28));
      ctx.fillStyle = trunk;
      ctx.fillRect(t.x + Math.floor((t.w - trunkW) / 2), t.y + Math.floor(t.h * 0.35), trunkW, Math.floor(t.h * 0.65));
      // Canopy: three stacked roundRects
      ctx.fillStyle = leaves;
      this.roundRect(ctx, t.x - 4, t.y + 4, t.w + 8, Math.floor(t.h * 0.34), 6);
      this.roundRect(ctx, t.x - 8, t.y + Math.floor(t.h * 0.18), t.w + 16, Math.floor(t.h * 0.28), 6);
      this.roundRect(ctx, t.x, t.y + Math.floor(t.h * 0.30), t.w, Math.floor(t.h * 0.22), 5);
      ctx.fill();
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, w, h, r);
    } else {
      // Fallback simple rect
      ctx.rect(x, y, w, h);
    }
  }
}


