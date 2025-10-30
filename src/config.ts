export const VIRTUAL_WIDTH = 960;
export const VIRTUAL_HEIGHT = 540;

// Fixed timestep (seconds)
export const FIXED_DT = 1 / 120; // 120Hz physics
export const MAX_CATCH_UP_STEPS = 8; // safeguard to avoid spiral of death

// Physics
export const GRAVITY = 2500; // px/s^2
export const JUMP_VELOCITY = -900; // px/s
export const COYOTE_TIME_MS = 100; // ms
export const JUMP_BUFFER_MS = 120; // ms

// World speed (px/s)
export const START_SPEED = 600;
export const MAX_SPEED = 1300;
export const SPEED_ACCEL_PER_SEC = 6; // ~600 increase over ~100s

// Ground line (y) relative to virtual height
export const GROUND_Y = 420; // ground collision Y baseline

// Spawner
export const MIN_GAP_BASE = 250; // px
export const MIN_GAP_K = 0.6; // scales with speed

// Scoring
export const SCORE_PER_PX = 0.01; // tune to your liking
export const SCORE_BLINK_INTERVAL = 100; // points threshold for blink

// Preferences / features
export const ENABLE_CAMERA_SHAKE = true;

// Storage keys
export const STORAGE_KEYS = {
  hiScore: 'dino.hiScore',
  mute: 'dino.mute',
  bestSpeed: 'dino.bestSpeed',
  rngSeed: 'dino.rngSeed'
} as const;

// Debug defaults
export const DEFAULT_RNG_SEED = 0xdecafbad >>> 0;


