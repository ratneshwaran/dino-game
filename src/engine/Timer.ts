import { FIXED_DT, MAX_CATCH_UP_STEPS } from '../config';

export type UpdateCallback = (dtFixed: number, alpha: number, now: number) => void;

export class Timer {
  private accumulator = 0;
  private lastTime = 0;
  private handle = 0;
  private running = false;
  private callback: UpdateCallback;

  constructor(callback: UpdateCallback) {
    this.callback = callback;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const tick = () => {
      if (!this.running) return;
      const now = performance.now();
      let frameTime = (now - this.lastTime) / 1000;
      if (frameTime > 0.25) frameTime = 0.25; // clamp giant spikes
      this.lastTime = now;
      this.accumulator += frameTime;

      let steps = 0;
      while (this.accumulator >= FIXED_DT && steps < MAX_CATCH_UP_STEPS) {
        this.callback(FIXED_DT, 0, now);
        this.accumulator -= FIXED_DT;
        steps++;
      }
      const alpha = Math.min(1, this.accumulator / FIXED_DT);
      this.callback(0, alpha, now); // render/update interpolation
      this.handle = requestAnimationFrame(tick);
    };
    this.handle = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.handle);
  }
}


