# Focus Timer — Active Context

## Current Focus
Design phase of the page redesign. The user's vision is captured in `design.md`
(filled in, no more `[TODO]`s): graceful/calm nature look — huge Cormorant
Garamond serif digits, liquid green-white blob background with grain, cursor
glow + parallax, tapered top progress bar, quiet auto-hiding text buttons,
breathing digits, type-in duration editor.

A **tunable prototype** now lives in `design-prototype/` (plain HTML/CSS/JS,
no dependencies, opened directly in the browser). The user tunes sliders
(blobs, morph speed, blur, grain, parallax, glow, breath) and clicks
"Copy values" to produce JSON to paste back; those values then get locked
into `design.md` (replacing `TUNE` markers).

## Recent Changes
- Filled `design.md` completely from a Q&A design session (9 questions):
  vision, principles, tokens (light-only V1), layout, time input mechanics
  (iOS-style continuous digits), states (idle/running-breathe/paused-still/
  finished-bloom), motion & interaction (auto-hide controls, taper bar)
- Updated V1 scope to include the type-in duration editor:
  `memory-bank/projectbrief.md` and `AGENTS.md` (old "nothing more" wording
  replaced; "no duration picker" prohibition removed from scope)
- Built `design-prototype/`: `index.html`, `styles.css`, `blob.js`
  (canvas engine: blobs + grain + parallax + glow + finished bloom),
  `controls.js` (sliders, 3 presets Lagoon/Mist/Tide, state cycler,
  copy-values-to-JSON, auto-hide controls demo)
- Prototype launched via `Invoke-Item` for user tuning

## Next Steps
- User must explicitly approve the font package
  (`@expo-google-fonts/cormorant-garamond`) before install
- Implement redesign in slices: `theme.ts` tokens → `CountdownDisplay`
  (serif digits + type-in editing) → `CountdownControls`/`Button` →
  background/bar/glow → screen layout
- Verify each slice: `npx tsc --noEmit`, `npm test`, visual check via
  `npx expo start` (press `w`)
- Update `memory-bank/progress.md` after implementation slices land

## Decisions & Considerations
- Final user-tuned values locked into `design.md` §8: 9–15 blobs
  (default 14), size 0.33, morph 1.0, blur 54, grain 0.035, parallax 17,
  glow 400px/0.3, breath 3%/12s
- Blobs are "living": autonomous drift (lissajous), per-blob random shape /
  size (0.25–2.4×) / opacity depth (0.12–1.0) / blur (0.4–1.8×) / green
  tone, ~60s lifespan with 8s fade-in and 12s fade-out, replaced by new
  spawns; cursor parallax still applies per depth
- Light-only theme for V1; dark "dusk" variant deferred to a future version
- Font choice: Cormorant Garamond weight 300 (needs approval per rules)
- Type-in editing only in Idle; continuous right-aligned digit stream
  (`1230` → 12:30, `13000` → 01:30:00); hours appear only when needed
- States: running digits breathe (3% scale, 12s cycle); paused = blob stills +
  digits 70% opacity; finished = one blob swell + single glow pulse, bar
  fades out quietly
- Controls auto-hide after ~3s of no mouse movement; touch toggles on tap
- Existing countdown logic (1s interval decrement model, Start=Resume) is
  unchanged and remains verified (19/19 tests pass)