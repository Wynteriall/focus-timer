# Focus Timer — Active Context

## Current Focus
Resuming the redesign implementation. `design.md` is complete and its tuned
values are locked; `design-prototype/` is the living reference. Work stopped
after **slice 1** (design tokens, motion constants, duration-entry + countdown
state), which is committed (see `git log` — `feat: redesign slice 1`).
Slice 0 (this docs checkpoint) is the tip of that commit; the working tree is
clean, so slice 1 only needs reading, not recovery.

## Recent Changes
- Slice 1 implemented and green: `src/constants/theme.ts` (tokens, light-only),
  `src/constants/motion.ts` (`Motion` + `BackgroundParams`),
  `src/hooks/duration-format.ts` (+tests), `src/hooks/use-duration-entry.ts`
  (+tests), `src/hooks/use-countdown.ts` (+`isFinished`, `setDuration`, +12 tests)
- `@expo-google-fonts/cormorant-garamond@^0.4.1` installed (approval granted)
- Last verification: `npx tsc --noEmit` clean · `npm test` 41/41 (5 suites)
- Memory bank updated to record the redesign status (this file, `progress.md`,
  `redesign-plan.md`, `systemPatterns.md`, `techContext.md`, `productContext.md`)

## Next Steps
1. Slice 0: done — slice 1 and this docs checkpoint are committed
2. Slice 1: `_layout.tsx` — import `@/global.css`, load
   `CormorantGaramond_300Light` with `useFonts` gating
   `SplashScreen.hideAsync()`, drop dark-theme switching; `app.json` →
   `userInterfaceStyle: "light"`; `jest.setup.ts` → mock `expo-font` `useFonts`
   to `[true, null]`
3. Slice 2: `CountdownDisplay` — serif digits `clamp(96px, 22vw, 320px)`,
   `formatDuration` (`h:mm:ss` when hours), running breathe 3%/12s, paused 70%
   opacity, finished glow pulse + settle 1.05, idle type-in editing
   (digits/Backspace/Enter, edited group ~1.1×, commit rise 0.3em + 400ms fade)
4. Slice 3: `text-button.tsx` (borderless, hover glow underline ~200ms,
   disabled 40% opacity, never unmounted) + `CountdownControls`
   (Begin/Resume · Pause · Reset) + `use-idle-visibility` (3s auto-hide, wake
   on pointer movement, tap toggles on touch)
5. Slice 4: `progress-bar.tsx` — top inset 24, 3px thick, tapered to points,
   symmetric depletion, quiet fade-out on finish
6. Slice 5: background — **blocked on the renderer decision** (below)
7. Slice 6: screen assembly per design §5; slice 7: final verification
   (`npx tsc --noEmit`, `npm test`, `npx expo export -p web`, manual
   `npx expo start` + `w` against the prototype), docs, commit

## Decisions & Considerations
- Locked values (design §8): 14 blobs, size 0.33, morph 1.0, blur 54,
  grain 0.035, parallax 17, glow 400px/0.3, breath 3%/12s
- Blobs are "living": autonomous lissajous drift, per-blob shape / size
  (0.25–2.4×) / opacity depth (0.12–1.0) / blur (0.4–1.8×) / green tone, ~60s
  lifespan (8s in, 12s out) then respawn — the field never repeats
- Light-only V1; digits in Cormorant Garamond 300; no caption text anywhere
- Type-in editing only in Idle; continuous right-aligned digit stream
  (`1230` → 12:30, `13000` → 01:30:00) already implemented in
  `use-duration-entry`
- Paused = background time ~3% + digits 70% opacity; finished = one blob swell
  + one digital glow pulse, bar fades out quietly
- Motion via RN core `Animated`; reanimated 4 installed but unused
- **Open decision (blocks slice 5):** background renderer —
  (a) `react-native-svg`: organic sine-perturbed paths, radial gradients,
  `feTurbulence` grain, works on web (real DOM SVG) + native — recommended;
  (b) `@shopify/react-native-skia`: closest 1:1 port of `blob.js`, heaviest,
  needs CanvasKit on web + jest mocks; (c) no new dependencies: layered Views,
  geometric ellipses, no per-blob blur. (a)/(b) need explicit approval
- react-native-web 0.21 supports none of `filter`, `mixBlendMode`,
  `experimental_backgroundImage`; don't rely on them for web
- Constraints unchanged: no `any`, files < 120 lines, `npx expo install` only,
  no unapproved libraries