import { GROUND_Y, MAX_SPEED, SPEED_ACCEL_PER_SEC, START_SPEED, VIRTUAL_WIDTH } from '../config';

export class World {
  speed = START_SPEED;
  groundX = 0; // for tiling
  worldX = 0; // distance traveled in world space

  update(dt: number): void {
    if (dt > 0) {
      this.speed = Math.min(MAX_SPEED, this.speed + SPEED_ACCEL_PER_SEC * dt);
      const dx = this.speed * dt;
      this.groundX = (this.groundX + dx) % 64; // tile size for pattern
      this.worldX += dx;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Background sky
    ctx.fillStyle = '#eae7df';
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, GROUND_Y + 60);

    // Ground
    ctx.fillStyle = '#b3a48a';
    ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, 4);
    ctx.fillStyle = '#c8b79b';
    for (let x = -64; x < VIRTUAL_WIDTH + 64; x += 64) {
      const gx = Math.floor(x - this.groundX);
      ctx.fillRect(gx, GROUND_Y + 4, 48, 10);
      ctx.fillRect(gx + 10, GROUND_Y + 16, 24, 6);
    }
  }
}


