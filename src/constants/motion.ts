/**
 * Motion constants from `design.md` §7–§8 (tuned values locked).
 * All durations are milliseconds; slow and eased — nothing bounces.
 */

export const Motion = {
  /** Running digits breathe: 3% scale over a 12s cycle */
  breathScale: 0.03,
  breathPeriodMs: 12000,
  /** Paused digits soften to ~70% opacity */
  pausedOpacity: 0.7,
  pausedOpacityMs: 400,
  /** Commit: digits rise from below ~0.3em and fade in */
  commitRiseMs: 400,
  /** Finished: one glow pulse, settles ~5% larger */
  bloomPulseMs: 1600,
  bloomSettleScale: 1.05,
  /** Controls fade out after ~3s without mouse movement */
  autoHideMs: 3000,
  controlsFadeMs: 600,
  /** Bar fades out quietly on finish */
  barFadeOutMs: 1200,
  /** Hover underline bloom */
  hoverBloomMs: 200,
  /** Finished blob swell is one slow deep pulse */
  blobBloomMs: 2400,
  /** Paused state slows global background time to ~3% */
  pausedTimeScale: 0.03,
} as const;

/** Locked background parameters from `design.md` §8. */
export const BackgroundParams = {
  blobCount: 14,
  blobSize: 0.33,
  morphSpeed: 1.0,
  blur: 54,
  grain: 0.035,
  parallax: 17,
  glowSize: 400,
  glowIntensity: 0.3,
} as const;