import { SCORE_BLINK_INTERVAL, SCORE_PER_PX, STORAGE_KEYS } from '../config';

export class Score {
  private _score = 0;
  private _hi = 0;
  private pxAccum = 0;
  private blinkUntil = 0;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEYS.hiScore);
    this._hi = saved ? parseInt(saved, 10) || 0 : 0;
  }

  addDistance(px: number, nowMs: number): void {
    this.pxAccum += px * SCORE_PER_PX;
    const gained = Math.floor(this.pxAccum);
    if (gained > 0) {
      const before = this._score;
      this._score += gained;
      this.pxAccum -= gained;
      if (Math.floor(before / SCORE_BLINK_INTERVAL) !== Math.floor(this._score / SCORE_BLINK_INTERVAL)) {
        this.blinkUntil = nowMs + 400;
      }
      if (this._score > this._hi) {
        this._hi = this._score;
        localStorage.setItem(STORAGE_KEYS.hiScore, String(this._hi));
      }
    }
  }

  resetRun(): void {
    this._score = 0;
    this.pxAccum = 0;
    this.blinkUntil = 0;
  }

  get value(): number {
    return this._score;
  }

  get hi(): number {
    return this._hi;
  }

  get blinking(): boolean {
    return performance.now() < this.blinkUntil;
  }
}


