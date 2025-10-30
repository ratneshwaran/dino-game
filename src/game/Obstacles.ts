import { GROUND_Y } from '../config';
import { AABB } from './Collision';

export type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'cactus_small' | 'cactus_large' | 'bird';
};

export class Obstacles {
  list: Obstacle[] = [];

  spawn(kind: Obstacle['kind'], startX: number, heightIdx: number = 0): void {
    if (kind === 'bird') {
      const sizes = { w: 42, h: 26 };
      const heights = [GROUND_Y - 24, GROUND_Y - 60, GROUND_Y - 100];
      const y = heights[Math.max(0, Math.min(heights.length - 1, heightIdx))] - sizes.h;
      this.list.push({ x: startX, y, w: sizes.w, h: sizes.h, kind });
      return;
    }
    const size = kind === 'cactus_small' ? { w: 24, h: 40 } : { w: 34, h: 60 };
    const y = GROUND_Y - size.h;
    this.list.push({ x: startX, y, w: size.w, h: size.h, kind });
  }

  update(speed: number, dt: number): void {
    for (const o of this.list) o.x -= speed * dt;
    this.list = this.list.filter((o) => o.x + o.w > -50);
  }

  aabbs(): AABB[] {
    return this.list.map((o) => ({ x: o.x, y: o.y, w: o.w, h: o.h }));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const o of this.list) {
      if (o.kind === 'bird') {
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(o.x, o.y + 8, o.w, o.h - 8);
        // wings
        ctx.fillStyle = '#2b2b2b';
        ctx.fillRect(o.x + 8, o.y, 12, 8);
        ctx.fillRect(o.x + 24, o.y + 2, 10, 6);
      } else {
        ctx.fillStyle = '#226622';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#2c8030';
        ctx.fillRect(o.x + 6, o.y + 4, 6, o.h - 8);
        ctx.fillRect(o.x + o.w - 10, o.y + 10, 6, o.h - 14);
      }
    }
  }
}


