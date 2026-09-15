# Focus Timer — Project Brief

## Goal
Build a minimal focus timer app: an on-screen visual countdown with start,
pause, and reset controls, plus a type-in duration editor on the timer itself.

## V1 Scope (source of truth)
- Visual countdown display (mm:ss readout, h:mm:ss when hours are needed)
- Editable duration: in the idle state, the readout accepts typed input with
  automatic formatting from a continuous digit stream (iOS clock style)
- Start button (begins the countdown)
- Pause button (freezes the countdown; resumable)
- Reset button (restores the initial duration, stops the countdown)

## Prohibitions (V1)
- No audio or sound effects
- No haptics
- No push notifications

## Success Criteria
- Countdown ticks accurately and stops at zero
- Typed durations format correctly (e.g., `1230` → 12:30, `13000` → 01:30:00)
- Pause/resume preserves remaining time
- Reset works from any state, including while running
- Strict TypeScript passes (`npx tsc --noEmit`) with zero errors
- Hook logic covered by unit tests
