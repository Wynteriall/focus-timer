# Focus Timer — Project Brief

## Goal
Build a minimal focus timer app: an on-screen visual countdown with start,
pause, and reset controls. Nothing more for V1.

## V1 Scope (source of truth)
- Visual countdown display (mm:ss readout)
- Start button (begins the countdown)
- Pause button (freezes the countdown; resumable)
- Reset button (restores the initial duration, stops the countdown)

## Prohibitions (V1)
- No audio or sound effects
- No haptics
- No push notifications

## Success Criteria
- Countdown ticks accurately and stops at zero
- Pause/resume preserves remaining time
- Reset works from any state, including while running
- Strict TypeScript passes (`npx tsc --noEmit`) with zero errors
- Hook logic covered by unit tests
