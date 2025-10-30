import { VIRTUAL_WIDTH } from '../config';

export class UI {
  debug = false;

  drawScore(ctx: CanvasRenderingContext2D, score: number, hi: number, blinking: boolean): void {
    ctx.fillStyle = blinking ? '#ff6' : '#222';
    ctx.font = '16px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    const scoreStr = score.toString().padStart(5, '0');
    const hiStr = hi.toString().padStart(5, '0');
    ctx.fillText(`HI ${hiStr}  ${scoreStr}`, VIRTUAL_WIDTH - 16, 12);
  }

  drawDebug(
    ctx: CanvasRenderingContext2D,
    data: { dtMs: number; speed: number; obstacles: number; seed: number }
  ): void {
    if (!this.debug) return;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(8, 8, 220, 70);
    ctx.fillStyle = '#0f0';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`dt: ${data.dtMs.toFixed(2)} ms`, 14, 14);
    ctx.fillText(`speed: ${Math.round(data.speed)} px/s`, 14, 30);
    ctx.fillText(`obstacles: ${data.obstacles}`, 14, 46);
    ctx.fillText(`seed: ${data.seed}`, 14, 62);
  }
}


