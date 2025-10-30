export class AudioManager {
  private ctx?: AudioContext;
  private _muted = false;

  get muted(): boolean {
    return this._muted;
  }

  set muted(v: boolean) {
    this._muted = v;
  }

  private ensureCtx(): AudioContext | undefined {
    if (this._muted) return undefined;
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return this.ctx;
  }

  beep(freq = 880, durationMs = 100, type: OscillatorType = 'square'): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMs / 1000);
    osc.stop(t0 + durationMs / 1000 + 0.01);
  }
}


