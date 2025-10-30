export type InputSnapshot = {
  jumpPressed: boolean;
  jumpDown: boolean;
  duckDown: boolean;
  pausePressed: boolean;
  debugPressed: boolean;
  mutePressed: boolean;
};

export class Input {
  private keys = new Set<string>();
  private press = new Set<string>();

  private btnJump?: HTMLButtonElement;
  private btnDuck?: HTMLButtonElement;
  private btnPause?: HTMLButtonElement;

  constructor() {}

  attach(): void {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));

    this.btnJump = document.getElementById('btn-jump') as HTMLButtonElement | undefined;
    this.btnDuck = document.getElementById('btn-duck') as HTMLButtonElement | undefined;
    this.btnPause = document.getElementById('btn-pause') as HTMLButtonElement | undefined;

    const prevent = (e: Event) => e.preventDefault();
    const bindHold = (el: HTMLButtonElement | undefined, key: string) => {
      if (!el) return;
      el.addEventListener('pointerdown', (e) => {
        prevent(e);
        this.keys.add(key);
        this.press.add(key);
      });
      el.addEventListener('pointerup', (e) => {
        prevent(e);
        this.keys.delete(key);
      });
      el.addEventListener('pointerleave', () => this.keys.delete(key));
    };
    bindHold(this.btnJump, 'Space');
    bindHold(this.btnDuck, 'ArrowDown');
    if (this.btnPause) {
      this.btnPause.addEventListener('click', (e) => {
        prevent(e);
        this.press.add('KeyP');
      });
    }
  }

  private onKey(e: KeyboardEvent, down: boolean): void {
    const code = e.code;
    if (down) {
      if (!this.keys.has(code)) this.press.add(code);
      this.keys.add(code);
    } else {
      this.keys.delete(code);
    }
  }

  snapshot(): InputSnapshot {
    const s: InputSnapshot = {
      jumpPressed: this.consumePressed('Space') || this.consumePressed('ArrowUp'),
      jumpDown: this.keys.has('Space') || this.keys.has('ArrowUp'),
      duckDown: this.keys.has('ArrowDown'),
      pausePressed: this.consumePressed('KeyP'),
      debugPressed: this.consumePressed('KeyD'),
      mutePressed: this.consumePressed('KeyM')
    };
    return s;
  }

  private consumePressed(code: string): boolean {
    const had = this.press.has(code);
    if (had) this.press.delete(code);
    return had;
  }
}


