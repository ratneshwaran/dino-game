# Dinosaur Runner

Fast, polished endless-runner inspired by the Chrome Dino, built with HTML5 Canvas and TypeScript (no engines).

## Dev

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test
```

## Controls

- Desktop: Space/Up = Jump, Down = Duck, P = Pause, M = Mute, D = Debug overlay
- Mobile: On-screen Jump/Duck/Pause buttons (hidden on desktop)

## Difficulty & Tuning

Edit `src/config.ts`:
- START_SPEED, MAX_SPEED, SPEED_ACCEL_PER_SEC
- GRAVITY, JUMP_VELOCITY, COYOTE_TIME_MS, JUMP_BUFFER_MS
- MIN_GAP_BASE, MIN_GAP_K (obstacle spacing)
- SCORE_PER_PX, SCORE_BLINK_INTERVAL

## Assets

All assets in `src/assets` are original placeholders. Swap PNGs and WAVs with your own:
- Sprites: `src/assets/sprites/*.png`
- Audio: `src/assets/audio/*.wav`

Current build uses procedural placeholder art and generated beeps so it runs without files. Replace drawings with sprite rendering later.

## Notes

- Single `<canvas>` using 2D context, crisp pixel rendering.
- Fixed timestep accumulator (120Hz physics) with interpolation and catch-up cap.
- Seeded RNG and debug overlay (toggle with D) show dt, speed, obstacles, RNG seed.
- High score and mute state persisted in `localStorage`.
