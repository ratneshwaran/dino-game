import { Renderer } from './Renderer';
import { Timer } from './Timer';
import { Input } from './Input';
import { AudioManager } from './Audio';
import { RNG } from './RNG';
import { DEFAULT_RNG_SEED, STORAGE_KEYS, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../config';
import { GameState } from '../game/State';
import { World } from '../game/World';
import { Player } from '../game/Player';
import { Obstacles } from '../game/Obstacles';
import { intersects } from '../game/Collision';
import { Score } from '../game/Score';
import { UI } from '../game/UI';
import { Parallax } from '../game/Parallax';
import { DayNight } from '../game/DayNight';
import { Spawner } from '../game/Spawner';
import { Trees } from '../game/Trees';

export class Game {
  readonly renderer: Renderer;
  readonly timer: Timer;
  readonly input: Input;
  readonly audio: AudioManager;
  readonly rng: RNG;

  state: GameState = GameState.Ready;
  world = new World();
  player = new Player();
  obstacles = new Obstacles();
  score = new Score();
  ui = new UI();
  lastDtMs = 0;
  seed: number;
  parallax = new Parallax();
  dayNight = new DayNight();
  spawner: Spawner;
  lastScoreVal = 0;
  shakeUntil = 0;
  reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  flashUntil = 0;
  trees!: Trees;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.input.attach();
    this.audio = new AudioManager();
    // restore mute
    const savedMute = localStorage.getItem(STORAGE_KEYS.mute);
    if (savedMute != null) this.audio.muted = savedMute === '1';
    const savedSeed = Number(localStorage.getItem(STORAGE_KEYS.rngSeed) || '') || DEFAULT_RNG_SEED;
    this.seed = savedSeed >>> 0;
    this.rng = new RNG(this.seed);
    this.spawner = new Spawner(this.rng);
    this.trees = new Trees(this.rng);
    this.timer = new Timer((dtFixed, alpha, now) => this.tick(dtFixed, alpha, now));
  }

  start(): void {
    this.timer.start();
  }

  private resetRun(): void {
    this.world = new World();
    this.player = new Player();
    this.obstacles = new Obstacles();
    this.score.resetRun();
    this.lastScoreVal = 0;
    this.shakeUntil = 0;
    this.trees = new Trees(this.rng);
  }

  private tick(dtFixed: number, _alpha: number, now: number): void {
    const ctx = this.renderer.ctx;
    const inp = this.input.snapshot();
    if (inp.debugPressed) this.ui.debug = !this.ui.debug;
    if (inp.mutePressed) {
      this.audio.muted = !this.audio.muted;
      localStorage.setItem(STORAGE_KEYS.mute, this.audio.muted ? '1' : '0');
    }
    if (inp.pausePressed) {
      this.state = this.state === GameState.Paused ? GameState.Running : GameState.Paused;
    }

    const dtMs = dtFixed * 1000;
    if (dtFixed > 0 && this.state === GameState.Running) {
      // Update
      this.world.update(dtFixed);
      this.parallax.update(this.world.speed, dtFixed);
      this.dayNight.update(dtFixed);
      this.trees.update(this.world.speed, dtFixed);
      this.player.update(dtFixed, now, inp);
      this.obstacles.update(this.world.speed, dtFixed);
      // Spawning
      const plan = this.spawner.maybeSpawn(this.world.worldX, this.score.value, this.world.speed);
      if (plan) {
        const startX = VIRTUAL_WIDTH + this.rng.int(20, 160);
        if (plan.kind === 'bird') this.obstacles.spawn('bird', startX, plan.heightIdx ?? 0);
        else this.obstacles.spawn(plan.kind, startX);
      }
      // Collision
      const a = this.player.aabb();
      for (const b of this.obstacles.aabbs()) {
        if (intersects(a, b)) {
          this.state = GameState.GameOver;
          if (!this.audio.muted) this.audio.beep(120, 180, 'sawtooth');
          if (!this.reduceMotion) this.shakeUntil = now + 140;
          this.flashUntil = now + 100;
        }
      }
      // Score
      this.score.addDistance(this.world.speed * dtFixed, now);
      if (Math.floor(this.score.value / 100) > Math.floor(this.lastScoreVal / 100)) {
        if (!this.audio.muted) this.audio.beep(1400, 80, 'triangle');
      }
      this.lastScoreVal = this.score.value;
    }
    this.lastDtMs = dtMs;

    // Handle high-level inputs based on state
    if (this.state === GameState.Ready) {
      // Press jump to start
      if (inp.jumpPressed) {
        this.resetRun();
        this.state = GameState.Running;
        if (!this.audio.muted) this.audio.beep(880, 70, 'square');
      }
    } else if (this.state === GameState.GameOver) {
      // restart
      if (inp.jumpPressed) {
        this.resetRun();
        this.state = GameState.Running;
        if (!this.audio.muted) this.audio.beep(880, 70, 'square');
      }
    }

    // Render
    // Camera shake
    const nowMs = performance.now();
    const shaking = nowMs < this.shakeUntil && !this.reduceMotion;
    const ox = shaking ? (Math.random() * 6 - 3) : 0;
    const oy = shaking ? (Math.random() * 4 - 2) : 0;

    this.renderer.clear();
    ctx.save();
    ctx.translate(ox, oy);
    this.world.draw(ctx);
    this.parallax.draw(ctx);
    this.trees.draw(ctx);
    this.obstacles.draw(ctx);
    this.player.draw(ctx);
    ctx.restore();
    this.ui.drawScore(ctx, this.score.value, this.score.hi, this.score.blinking);

    // Day/Night tint overlay
    const a = this.dayNight.alpha;
    if (a > 0) {
      ctx.fillStyle = `rgba(0,0,20,${a.toFixed(3)})`;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }
    // Collision flash
    if (performance.now() < this.flashUntil) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    if (this.state === GameState.Ready) this.drawCenterText('Press Space / Tap to Start');
    if (this.state === GameState.Paused) this.drawCenterText('Paused');
    if (this.state === GameState.GameOver) this.drawCenterText('Game Over — Press Space');

    this.ui.drawDebug(ctx, {
      dtMs: this.lastDtMs,
      speed: this.world.speed,
      obstacles: this.obstacles.list.length,
      seed: this.seed
    });
  }

  private drawCenterText(text: string): void {
    const ctx = this.renderer.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, VIRTUAL_HEIGHT / 2 - 30, VIRTUAL_WIDTH, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2);
  }
}


