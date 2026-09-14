# Focus Timer — Progress

## Completed
- Project scaffolding with Expo SDK 57 and expo-router
- Strict TypeScript config with path aliases
- Documentation restructured into the memory bank (`memory-bank/`)
- Testing tooling installed (jest-expo, @testing-library/react-native)
- Template scaffolding stripped (Explore tab, AppTabs, demo components removed)
- `useCountdown` hook (TDD): 9 unit tests with jest fake timers — all pass
- `CountdownDisplay` and `CountdownControls` components (10 tests — all pass)
- Countdown screen wired in `src/app/index.tsx`; single-screen layout

## What Works
- App boots to a countdown screen (web export verified)
- Light/dark themed countdown readout (mono, tabular digits)
- Start / Pause / Resume / Reset with correct state transitions
- Verification loop: `npx tsc --noEmit` (clean), `npm test` (19/19 pass)

## What's Left (V1)
- [ ] Commit the V1 work
- [ ] Optional: ESLint setup (`npx expo lint`)

## Known Issues
- Test API notes (not bugs): @testing-library/react-native v14 requires
  awaited `render`/`renderHook`, and `userEvent` (not `fireEvent`) for presses
  to avoid leaking act scopes

## Decision Log
- Tabs removed: V1 is a single countdown screen
- TDD scoped to `useCountdown` (logic) — presentation verified via typecheck
  and light render tests
- 1s interval decrement timer model; revisit with timestamp-deadline model
  if timing precision becomes a requirement
