# Focus Timer — Progress

## Completed
- Project scaffolding with Expo SDK 57 and expo-router
- Strict TypeScript config with path aliases
- Documentation restructured into the memory bank (`memory-bank/`)
- Testing tooling installed (jest-expo, @testing-library/react-native)
- Template scaffolding stripped (Explore tab, AppTabs, demo components removed)
- V1 countdown committed (253a6fe): `useCountdown`, `CountdownDisplay`,
  `CountdownControls`, single-screen layout in `src/app/index.tsx`
- `@expo-google-fonts/cormorant-garamond@^0.4.1` installed (approved)
- **Redesign slice 1 — implemented and committed** (commit: `feat: redesign slice 1`)
  - `src/constants/theme.ts`: design tokens (§4) — `text` #22301F, `accent`
    #5F8465, `accentSoft` #DCE9DC, light-only `Colors`, `DigitFont`,
    `Spacing`, `MaxContentWidth`
  - `src/constants/motion.ts` (new): `Motion` + `BackgroundParams` (design §8)
  - `src/hooks/duration-format.ts` (new, 7 tests) + `duration-format.test.ts`
  - `src/hooks/use-duration-entry.ts` (new, 9 tests) + `.test.ts`
  - `src/hooks/use-countdown.ts`: added `isFinished` + `setDuration` (15 tests)

## What Works
- App boots to a single countdown screen (web verified)
- Start / Pause / Resume / Reset with correct transitions; stops at zero
- Type-in duration logic at hook level (digit stream → seconds, draft state)
- Verification loop: `npx tsc --noEmit` clean · `npm test` 41/41 pass
  (5 suites: duration-format 7, use-duration-entry 9, use-countdown 15,
  countdown-display 3, countdown-controls 7)

## Redesign Status — RESUME HERE
- Spec of record: `design.md` (complete; §8 values locked from the prototype)
- Living reference: `design-prototype/` (plain HTML/CSS/JS, opens in a browser)
- Slice plan, file map and per-slice verification: `memory-bank/redesign-plan.md`

| # | Slice | Status |
| - | ----- | ------ |
| 0 | Docs checkpoint + commit slice 1 | ✅ done |
| 1 | Font loading + theme plumbing (`_layout`, `global.css`, light-only) | ⬜ not started |
| 2 | `CountdownDisplay` (serif digits, states, type-in editing) | ⬜ not started |
| 3 | `Button`/`CountdownControls` (text buttons, auto-hide) | ⬜ not started |
| 4 | `ProgressBar` (tapered, symmetric, quiet fade on finish) | ⬜ not started |
| 5 | Background (blobs, grain, glow, parallax) | ⛔ blocked — renderer decision |
| 6 | Screen assembly (`src/app/index.tsx`) | ⬜ not started |
| 7 | Final verification, docs, commit | ⬜ not started |

## Known Issues / Open Items
- This file is the authoritative resume point for the redesign (it had gone
  stale during the design phase and still claimed 19 tests)
- `src/global.css` is orphaned: `theme.ts` dropped its import and nothing else
  imports it → on web `Fonts.sans`/`serif` (`var(--font-display)`, …) resolve
  to nothing. Fix in slice 1 via `src/app/_layout.tsx`
- The font package is installed but never loaded (`DigitFont` is unused); needs
  `useFonts` in `_layout.tsx` gating `SplashScreen.hideAsync()`
- `app.json` still has `userInterfaceStyle: "automatic"` and `_layout.tsx`
  still swaps dark/light themes — both contradict design §4 (light-only V1)
- `countdown-display.tsx` still has a local `formatTime` duplicating the tested
  `formatDuration`; delete it and reuse the helper (slice 2)
- react-native-web 0.21.2 supports none of RN 0.86's `filter`, `mixBlendMode`
  or `experimental_backgroundImage` (verified: 0 hits across
  `node_modules/react-native-web/dist`) → those props work on iOS/Android and
  silently no-op on web, the primary target
- Background renderer not chosen (no `react-native-svg` / Skia installed)
- Test API notes: @testing-library/react-native v14 needs awaited
  `render`/`renderHook` and `userEvent` (not `fireEvent`) for presses
- Environment note: expo-doctor reports patch-level SDK 57 bumps available
  (`npx expo install --fix`) — benign drift, intentionally left to the user
- [ ] Optional: ESLint setup (`npx expo lint`) — outstanding since V1

## Decision Log
- Tabs removed: V1 is a single countdown screen
- TDD scoped to logic (hooks + pure helpers); presentation verified by
  typecheck, light render tests, and manual comparison with the prototype
- 1s interval decrement timer model retained (revisit timestamp-deadline model
  only if timing precision becomes a requirement)
- Light-only theme for V1; dark "dusk" theme deferred (design §4)
- Motion via React Native core `Animated` (RNW + jest friendly); reanimated 4
  is installed but intentionally unused
