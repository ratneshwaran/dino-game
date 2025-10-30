import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../config';

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private deviceScale = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize(): void {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    this.deviceScale = dpr;
    // Fit canvas buffer to virtual size scaled by DPR; CSS controls display size
    this.canvas.width = Math.floor(VIRTUAL_WIDTH * dpr);
    this.canvas.height = Math.floor(VIRTUAL_HEIGHT * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  }

  get scale(): number {
    return this.deviceScale;
  }
}


