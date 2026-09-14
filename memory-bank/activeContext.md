# Focus Timer — Active Context

## Current Focus
V1 countdown feature is complete and verified. No work in progress.

## Recent Changes
- Built `useCountdown` hook with targeted TDD (tests written first, then
  implementation): 9 hook tests using jest fake timers
- Added UI: `CountdownDisplay` (mm:ss readout, mono tabular digits),
  `CountdownControls` (start/pause/reset), generic `Button` widget
- Rewrote `src/app/index.tsx` as the countdown screen (5-minute initial
  duration, Start acts as Resume) and simplified `src/app/_layout.tsx`
- Testing tooling configured: jest-expo + @testing-library/react-native v14
  (note: `render`/`renderHook` are async; use `userEvent` for presses)
- Removed Expo template scaffolding (Explore tab, AppTabs, demo components)
- Added `"types": ["jest"]` to tsconfig (TS 6 did not auto-include @types/jest)
- Verified: `npx tsc --noEmit` clean, 19/19 tests pass, web export builds

## Next Steps
- Commit the V1 work
- Optional: set up ESLint (`npx expo lint`) if linting is desired

## Decisions & Considerations
- Countdown uses a 1s interval decrement model (drift acceptable for V1;
  switch to a timestamp-deadline model if precision matters later)
- Start acts as Resume when paused; start is a no-op when finished
- Reset always enabled; Pause disabled while idle; Start disabled while
  running or at zero
