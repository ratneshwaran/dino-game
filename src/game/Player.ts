import { COYOTE_TIME_MS, GROUND_Y, GRAVITY, JUMP_BUFFER_MS, JUMP_VELOCITY } from '../config';
import type { AABB } from './Collision';

export class Player {
  x = 140;
  y = GROUND_Y - 44;
  w = 44;
  h = 44;
  vy = 0;
  private lastGroundedMs = 0;
  private lastJumpPressMs = -9999;
  private onGround = true;
  private t = 0; // animation timer
  ducking = false;

  update(dt: number, nowMs: number, controls: { jumpPressed: boolean; jumpDown: boolean; duckDown: boolean }): void {
    this.t += dt;
    if (controls.duckDown && this.onGround) {
      this.ducking = true;
    } else {
      this.ducking = false;
    }

    if (controls.jumpPressed) this.lastJumpPressMs = nowMs;

    // Physics
    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;

    // Ground collision
    const targetH = this.ducking ? 30 : 44;
    const groundY = GROUND_Y - targetH;
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      if (!this.onGround) {
        this.onGround = true;
        this.lastGroundedMs = nowMs;
      }
    } else {
      this.onGround = false;
    }
    this.h = targetH;

    // Coyote time + jump buffer
    const canCoyote = nowMs - this.lastGroundedMs <= COYOTE_TIME_MS;
    const buffered = nowMs - this.lastJumpPressMs <= JUMP_BUFFER_MS;
    if ((this.onGround || canCoyote) && buffered && !this.ducking) {
      this.vy = JUMP_VELOCITY;
      this.onGround = false;
      this.lastJumpPressMs = -9999; // consume buffer
    }
  }

  aabb(): AABB {
    return { x: this.x + 6, y: this.y + 2, w: this.w - 12, h: this.h - 4 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Simple pixel-art style placeholder: body + legs animation
    ctx.fillStyle = '#444';
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + 28, this.y + 10, 5, 5);
    ctx.fillStyle = '#111';
    ctx.fillRect(this.x + 30, this.y + 12, 2, 2);
    // Legs animation
    const phase = Math.sin(this.t * 20);
    ctx.fillStyle = '#333';
    const legH = 10;
    ctx.fillRect(this.x + 8, this.y + this.h - legH, 8, legH + (phase > 0 ? -2 : 2));
    ctx.fillRect(this.x + 24, this.y + this.h - legH, 8, legH + (phase < 0 ? -2 : 2));
  }
}


