import { VIRTUAL_WIDTH } from '../config';

export class Parallax {
  private cloudsX = 0;
  private dunesX = 0;
  private reduce = false;

  constructor() {
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  update(baseSpeed: number, dt: number): void {
    const cloudsSpeed = baseSpeed * (this.reduce ? 0.1 : 0.3);
    const dunesSpeed = baseSpeed * (this.reduce ? 0.06 : 0.15);
    this.cloudsX = (this.cloudsX + cloudsSpeed * dt) % 256;
    this.dunesX = (this.dunesX + dunesSpeed * dt) % 256;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // clouds
    ctx.fillStyle = '#e4efe9';
    for (let x = -256; x < VIRTUAL_WIDTH + 256; x += 128) {
      const cx = Math.floor(x - this.cloudsX);
      this.drawCloud(ctx, cx, 70);
      this.drawCloud(ctx, cx + 50, 110);
    }
    // dunes (far background)
    ctx.fillStyle = '#d7ccb7';
    for (let x = -256; x < VIRTUAL_WIDTH + 256; x += 128) {
      const dx = Math.floor(x - this.dunesX);
      this.drawDune(ctx, dx, 300);
    }
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.beginPath();
    ctx.roundRect(x, y, 46, 18, 9);
    ctx.fill();
  }

  private drawDune(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.lineTo(x + 40, y + 10);
    ctx.lineTo(x + 80, y + 40);
    ctx.closePath();
    ctx.fill();
  }
}


