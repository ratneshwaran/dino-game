export class DayNight {
  private t = 0; // seconds since cycle start
  private duration = 38; // seconds per cycle

  update(dt: number): void {
    this.t = (this.t + dt) % this.duration;
  }

  // returns 0..1 alpha for night darkness
  get alpha(): number {
    const half = this.duration / 2;
    const d = Math.abs(this.t - half) / half; // 1 at midday/midnight, 0 at transition
    // invert and shape: darkest at t=half (night), brightest at t=0 (day)
    return Math.max(0, 1 - d) * 0.35; // 35% darkness at peak
  }
}


